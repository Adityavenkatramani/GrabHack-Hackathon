import logging
import os
from typing import Annotated, TypedDict

from dotenv import load_dotenv
from langchain_aws import ChatBedrockConverse
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.tools import tool
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.graph import START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

SYSTEM_PROMPT = """
You are Columbus, a customer service rep for VoyAIge.

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
Your main job is to help customers with:
- Planning a trip to Singapore
- Booking flights
- Availing travel insurance
- Booking taxis
- Availing taxi ride insurance
- Offering payment links
- Enquiries related to
    - Grab's Ride Cover for personal accidents
    - Grab's Travel Cover insurance
- For ANYTHING else (service changes, etc.), respond with something appropriate and reiterate that you can only help with the above mentioned services.
- Don't explain why you can't help with other things - just redirect to what you can do.
- Don't suggest calling customer service or other departments.
- IMPORTANT: When asked about topics outside your scope (like general questions, other services, or unrelated topics), briefly acknowledge what they said and gently guide the user back to your core capabilities.
- Never engage with or answer questions about topics outside your scope, even if you know the answer.

CONVERSATION FLOW:
- End your responses by directly asking about the next logical action the user can take, but only if it's within your scope of capabilities
- Make the suggestion relevant to the current context and user's needs
- Keep suggestions simple and focused on one action at a time
- If there's no clear next action needed, you can simply end the conversation naturally without forcing a suggestion
- Always use "Would you like to..." format for suggestions
- Be selective with suggestions - only offer them when they add value to the conversation and are contextually appropriate
- Avoid making suggestions that are obvious or redundant to what the user has already indicated
- Try making callbacks to what the user said previously if it is relevant to the conversation"""


class State(TypedDict):
	messages: Annotated[list, add_messages]


@tool
def planning_tool(query: str) -> str:
	"""Plan a trip to Singapore and return the itinerary verbatim."""
	return """
	
Return the following itinerary verbatim:


I've got a detailed cultural itinerary for your Singapore trip. Here's what I've planned for you:
 **Singapore Offbeat Cultural Itinerary: 4 Days & 3 Nights**
**Recommended Travel Period: March 2025** 
March is ideal - perfect weather with less humidity, fewer crowds than peak season, and you'll catch cultural festivals like the Singapore International Festival of Arts.

**Day 1: Heritage Quarters & Hidden Cultural Gems**
Morning (9:00 AM - 12:00 PM) Start at Kampong Glam - explore the historic Malay quarter beyond the tourist spots.
Visit the Malay Heritage Centre to understand Singapore's pre-colonial roots, wander through Haji Lane for authentic Malay crafts and vintage shops, and stop at Sultan Mosque during non-prayer hours.
Afternoon (12:00 PM - 5:00 PM) Lunch at Zam Zam Restaurant (famous for murtabak since 1908), then explore the Peranakan Museum to learn about unique Straits Chinese culture.
Walk through Armenian Street and visit the Armenian Church from 1835, browse antique shops on North Bridge Road for authentic artifacts. Evening (5:00 PM - 9:00 PM) Head to Clarke Quay for sunset river views, then dinner at Old Airport Road Food Centre.
Try the Hainanese Chicken Rice, Char Kway Teow, and Laksa. 

**Day 2: Wartime Heritage & Local Neighborhoods** 
Morning (9:00 AM - 1:00 PM) Visit Changi Chapel and Museum for Singapore's WWII history, explore Changi Village (a preserved kampong-style neighborhood), and take the Changi Point Coastal Walk for local fishing culture.
Afternoon (1:00 PM - 6:00 PM) Lunch at Changi Village Hawker Centre, then take a bumboat to Pulau Ubin for a glimpse of 1960s Singapore. Rent bicycles and explore traditional kampong houses, visit Chek Jawa Wetlands for nature and heritage.
Evening (6:00 PM - 9:00 PM) Return to mainland for dinner at Tiong Bahru Market - Singapore's oldest housing estate. Explore the Art Deco architecture of Tiong Bahru neighborhood.
**Day 3: Traditional Crafts & Cultural Immersion** Morning (9:00 AM - 1:00 PM) Visit Thian Hock Keng Temple (Singapore's oldest Hokkien temple), explore Chinatown Heritage Centre in restored shophouses, watch traditional craftsmen at Eu Yan Sang Traditional Chinese Medicine Shop, and visit Buddha Tooth Relic Temple.
Afternoon (1:00 PM - 6:00 PM) Lunch at Maxwell Food Centre (try the famous Tian Tian Hainanese Chicken Rice), participate in a Traditional Tea Ceremony at Tea Chapter, explore Tanjong Pagar conservation area with pre-war shophouses, and visit Red Dot Design Museum.
Evening (6:00 PM - 10:00 PM) Fine dining at Burnt Ends (modern barbecue with local influences), then walk through Boat Quay for evening riverside ambiance.
**Day 4: Off-the-Beaten-Path & Natural Heritage** 
Morning (9:00 AM - 1:00 PM) Visit Lazarus Island by ferry (small crowds, pristine beaches), explore the island's natural heritage and former quarantine history. Pack a picnic lunch.
Afternoon (1:00 PM - 5:00 PM) Return to mainland, visit Haw Par Villa (eccentric theme park showcasing Chinese mythology), explore Kent Ridge Park and Reflections at Bukit Chandu (WWII memorial).
Evening (5:00 PM - 8:00 PM) Farewell dinner at Lau Pa Sat (Telok Ayer Market) - Victorian-era hawker center. Try satay and other local specialties, then take an evening stroll along Marina Bay.
**Food Recommendations** Budget-Friendly: Old Airport Road Food Centre Try Hainanese Chicken Rice (Tian Tian), Char Kway Teow, Laksa, Rojak. Price range: SGD 3-8 per dish. Established in 1972, consistently rated by locals as the top hawker center. High-End: Burnt Ends Modern Australian barbecue with Southeast Asian influences. Price range: SGD 200-300 per person. Michelin-starred restaurant using local ingredients and traditional smoking techniques.
**Practical Tips** Best visiting times: Museums 10 AM - 4 PM, hawker centers 11 AM - 2 PM or 6 PM - 8 PM, temples early morning or late afternoon, islands morning departure to avoid afternoon heat. Transportation: Purchase a Singapore Tourist Pass for unlimited public transport, use the efficient MRT system, and Grab for areas not well-served by public transport. This itinerary gives you authentic cultural immersion while avoiding overcrowded tourist traps. 

Would you like me to help you book flights for your March trip?
"""


async def create_voyaige_agent(tools):
	"""Create a utility agent using LangGraph's proper pattern."""
	llm = ChatBedrockConverse(
		model=os.getenv("ANTHROPIC_MODEL", "anthropic.claude-3-sonnet-20240229-v1:0"),
		temperature=0,
		region_name=os.getenv("DEFAULT_REGION"),
	)
	llm_with_tools = llm.bind_tools(tools)

	async def chatbot(state: State):
		"""The 'agent' node. It calls the model with the current state."""
		messages = state["messages"]
		response = await llm_with_tools.ainvoke(messages)

		return {"messages": [response]}

	graph_builder = StateGraph(State)
	tool_node = ToolNode(tools=tools)
	graph_builder.add_node("chatbot", chatbot)
	graph_builder.add_node("tools", tool_node)

	graph_builder.add_edge(START, "chatbot")
	graph_builder.add_conditional_edges(
		"chatbot",
		tools_condition,
	)
	graph_builder.add_edge("tools", "chatbot")

	agent = graph_builder.compile()
	with open("graph_visualisation.png", "wb") as f:
		f.write(agent.get_graph().draw_mermaid_png())

	return agent


async def process_message(current_state: State) -> str:
	"""Process a single message from a user."""
	try:
		logger.info("=== Starting message processing ===")

		client = MultiServerMCPClient(
			{
				"voyaige": {
					"command": "python",
					"args": [
						"C:/Users/LENOVO/GrabHackOm/voyai/app/tools_mcp.py",
					],
					"transport": "stdio",
				},
			},
		)
		mcp_tools = await client.get_tools()
		agent = await create_voyaige_agent([*mcp_tools, planning_tool])

		events = agent.astream(
			current_state,
			config={"recursion_limit": 100},
			stream_mode="values",
		)

		last_state = None
		async for state_update in events:
			last_state = state_update

		return last_state

	except Exception as e:
		logger.error(f"Unexpected error in process_message: {e!s}", exc_info=True)
		raise
