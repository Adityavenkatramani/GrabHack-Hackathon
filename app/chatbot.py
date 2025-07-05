import asyncio
import logging
import os
from typing import Annotated, TypedDict

from dotenv import load_dotenv
from langchain_aws import ChatBedrockConverse
from langchain_core.messages import HumanMessage
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

SYSTEM_PROMPT = """
You are Columbus, a customer service rep for VoyAIge.
At the start of the conversation, greet the customer by name and introduce yourself.

TONE & PERSONALITY:
- You're calm, clear, and a bit dry-humored.
- You talk like a regular North American person—not stiff or overly formal, but not casual to the point of being unprofessional.
- You're friendly without being overly enthusiastic. You're empathetic and understanding.
- You like to throw in a light joke or comment if it fits the moment, especially to ease tension.
- You sound human, not like a script or bot.
- Always avoid using asterisks in your responses.
- Always avoid lists in your responses.
- End conversations naturally without forced enthusiasm or exclamation marks.
- Instead of saying "if you'd like..." or "let me know if...", directly ask "Would you like to...?"
- Keep responses concise and to the point.
- Use the customer's name only at the start of the conversation and when transitioning to a new topic after a long pause.
- Avoid repeatedly using the customer's name in every response - it can come across as artificial and overly formal.

CONVERSATION FLOW:
- End your responses by directly asking about the next logical action the user can take, but only if it's within your scope of capabilities
- Make the suggestion relevant to the current context and user's needs
- Keep suggestions simple and focused on one action at a time
- If there's no clear next action needed, you can simply end the conversation naturally without forcing a suggestion
- Always use "Would you like to..." format for suggestions
- Be selective with suggestions - only offer them when they add value to the conversation and are contextually appropriate
- Avoid making suggestions that are obvious or redundant to what the user has already indicated"""

# SCOPE & REDIRECTION:
# - You can help with: reporting outages, checking existing outages, looking up account balances/meter readings, handling billing/payments, analyzing usage patterns, and providing paperless billing information.
# - For ANYTHING else (service changes, etc.), respond with something appropriate and reiterate that you can only help with outages, existing outages, account balances/meter readings, billing/payments, and usage analysis.
# - Don't explain why you can't help with other things - just redirect to what you can do.
# - Don't suggest calling customer service or other departments.
# - IMPORTANT: When asked about topics outside your scope (like general questions, other services, or unrelated topics), briefly acknowledge what they said and gently guide the user back to your core capabilities.
# - Never engage with or answer questions about topics outside your scope, even if you know the answer.

# Your main job is to help customers with:
# - Reporting outages
# - Checking existing outages
# - Looking up account balances and meter readings
# - Checking billing information and due dates
# - Providing payment links
# - Analyzing usage patterns and explaining bill changes


class State(TypedDict):
    messages: Annotated[list, add_messages]


async def create_voyaige_agent(tools):
    """Create a utility agent using LangGraph's proper pattern."""
    # Initialize the model and bind the tools to it
    llm = ChatBedrockConverse(
        model=os.getenv("ANTHROPIC_MODEL", "anthropic.claude-3-sonnet-20240229-v1:0"),
        temperature=0,
        region_name=os.getenv("AWS_DEFAULT_REGION"),
    )
    llm_with_tools = llm.bind_tools(tools)

    async def chatbot(state: State):
        """The 'agent' node. It calls the model with the current state."""
        response = await llm_with_tools.ainvoke(state["messages"])
        return {"messages": [response]}

    # Create graph
    graph_builder = StateGraph(State)
    tool_node = ToolNode(tools=tools)
    graph_builder.add_node("chatbot", chatbot)
    graph_builder.add_node("tools", tool_node)
    graph_builder.add_conditional_edges(
        "chatbot",
        tools_condition,
    )
    graph_builder.add_edge("tools", "chatbot")
    graph_builder.set_entry_point("chatbot")
    checkpointer = InMemorySaver()
    return graph_builder.compile(checkpointer=checkpointer)


async def process_message(
    agent,
    user_input: str,
    customer_name: str,
) -> str:
    """Process a single message from a user."""
    try:
        logger.info("=== Starting message processing ===")
        logger.info(f"Input message: {user_input}")

        system_prompt = (
            SYSTEM_PROMPT + f"\n\nThe customer's full name is {customer_name}."
        )
        initial_messages = [{"role": "system", "content": system_prompt}]
        thread_id = f"{customer_name}"
        config = {"configurable": {"thread_id": thread_id}}

        logger.info(f"Using thread ID: {thread_id}")
        logger.info("Invoking agent with message")

        events = agent.astream(
            {"messages": [*initial_messages, HumanMessage(content=user_input)]},
            config,
            stream_mode="values",
        )

        last_message = None
        async for event in events:
            last_message = event["messages"][-1]

        if last_message:
            logger.info("Agent response received successfully")
            logger.info(f"Response content: {last_message.content[:100]}...")
            return last_message.content
        logger.error("No response from agent")
        return "I'm sorry, I wasn't able to process your request."

    except Exception as e:
        logger.error(f"Unexpected error in process_message: {e!s}", exc_info=True)
        raise


async def main():
    """Main async function to run the chatbot."""
    client = MultiServerMCPClient(
        {
            "voyaige": {
                "command": "python",
                "args": ["/home/varun/projects/GrabHack-Hackathon/app/tools_mcp.py"],
                "transport": "stdio",
            },
        },
    )
    mcp_tools = await client.get_tools()
    agent = await create_voyaige_agent(mcp_tools)

    response = await process_message(
        agent,
        user_input="I want to book a flight to new york from los angeles for 2 people starting from july 10th and ending on july 10th",
        customer_name="John Doe",
    )
    print(f"Final response:\n{response}")
    print("\n---\n")
    response = await process_message(
        agent,
        user_input="yes, i want it on the same day trip",
        customer_name="John Doe",
    )
    print(f"Final response:\n{response}")


if __name__ == "__main__":
    asyncio.run(main())
