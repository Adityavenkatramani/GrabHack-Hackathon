import logging
import os
from typing import Annotated, TypedDict

from dotenv import load_dotenv
from langchain_aws import ChatBedrockConverse
from langchain_mcp_adapters.client import MultiServerMCPClient
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

SCOPE & REDIRECTION:
- You can help with: booking flights, availing travel insurance, booking taxis, availing taxi ride insurance, and offering payment links.
- enquire about SBI Insurance, Grab's taxi ride insurance policy, Official policy document for Chubb Travel Cover insurance, Ride cover for personal accidents. 
- For ANYTHING else (service changes, etc.), respond with something appropriate and reiterate that you can only help with booking flights, availing travel insurance, booking taxis, availing taxi ride insurance, and offering payment links.
- Don't explain why you can't help with other things - just redirect to what you can do.
- Don't suggest calling customer service or other departments.
- IMPORTANT: When asked about topics outside your scope (like general questions, other services, or unrelated topics), briefly acknowledge what they said and gently guide the user back to your core capabilities.
- Never engage with or answer questions about topics outside your scope, even if you know the answer.

Your main job is to help customers with:
- Booking flights
- Availing travel insurance
- Booking taxis
- Availing taxi ride insurance
- Offering payment links

CONVERSATION FLOW:
- End your responses by directly asking about the next logical action the user can take, but only if it's within your scope of capabilities
- Make the suggestion relevant to the current context and user's needs
- Keep suggestions simple and focused on one action at a time
- If there's no clear next action needed, you can simply end the conversation naturally without forcing a suggestion
- Always use "Would you like to..." format for suggestions
- Be selective with suggestions - only offer them when they add value to the conversation and are contextually appropriate
- Avoid making suggestions that are obvious or redundant to what the user has already indicated"""


class State(TypedDict):
    messages: Annotated[list, add_messages]


async def create_voyaige_agent(tools):
    """Create a utility agent using LangGraph's proper pattern."""
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
    return graph_builder.compile()


async def process_message(current_state: State) -> str:
    """Process a single message from a user."""
    try:
        logger.info("=== Starting message processing ===")

        client = MultiServerMCPClient(
            {
                "voyaige": {
                    "command": "python",
                    "args": [
                        "/home/varun/projects/GrabHack-Hackathon/app/tools_mcp.py"
                    ],
                    "transport": "stdio",
                },
            },
        )
        mcp_tools = await client.get_tools()
        agent = await create_voyaige_agent(mcp_tools)

        event = agent.astream(
            current_state,
            config={"recursion_limit": 100},
            stream_mode="values",
        )

        async for state_update in event:
            last_state = state_update

        return last_state

    except Exception as e:
        logger.error(f"Unexpected error in process_message: {e!s}", exc_info=True)
        raise
