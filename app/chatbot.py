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
def trip_planning(query: str) -> str:
	"""Plan a trip to Singapore

	Args:
		query: The query to plan a trip to Singapore

	Returns:
		The itinerary for the trip to Singapore
	"""

	return """
Singapore Offbeat Cultural Itinerary: 4 Days & 3 Nights
Recommended Travel Period: March 2025
Why March? Perfect weather conditions (less humid, minimal rainfall), fewer crowds than peak season, and cultural festivals like the Singapore International Festival of Arts running during this period.
Day 1: Heritage Quarters & Hidden Cultural Gems
Morning (9:00 AM - 12:00 PM)

Start at Kampong Glam - Explore the historic Malay quarter beyond the tourist spots
Visit the Malay Heritage Centre to understand Singapore's pre-colonial roots
Wander through Haji Lane for authentic Malay crafts and vintage shops
Stop at Sultan Mosque during non-prayer hours

Afternoon (12:00 PM - 5:00 PM)

Lunch at Zam Zam Restaurant (famous for murtabak since 1908)
Explore Peranakan Museum to learn about the unique Straits Chinese culture
Walk through Armenian Street and visit the Armenian Church (1835)
Browse Antique shops on North Bridge Road for authentic artifacts

Evening (5:00 PM - 9:00 PM)

Head to Clarke Quay for sunset river views
Dinner at Old Airport Road Food Centre (Budget Option)
Try: Hainanese Chicken Rice, Char Kway Teow, Laksa

Day 2: Wartime Heritage & Local Neighborhoods
Morning (9:00 AM - 1:00 PM)

Visit Changi Chapel and Museum for Singapore's WWII history
Explore Changi Village - a preserved kampong-style neighborhood
Take the Changi Point Coastal Walk for local fishing culture

Afternoon (1:00 PM - 6:00 PM)

Lunch at Changi Village Hawker Centre
Take a bumboat to Pulau Ubin for a glimpse of 1960s Singapore
Rent bicycles and explore the island's traditional kampong houses
Visit Chek Jawa Wetlands for nature and heritage

Evening (6:00 PM - 9:00 PM)

Return to mainland
Dinner at Tiong Bahru Market - Singapore's oldest housing estate
Explore the Art Deco architecture of Tiong Bahru neighborhood

Day 3: Traditional Crafts & Cultural Immersion
Morning (9:00 AM - 1:00 PM)

Visit Thian Hock Keng Temple - Singapore's oldest Hokkien temple
Explore Chinatown Heritage Centre in restored shophouses
Watch traditional craftsmen at Eu Yan Sang Traditional Chinese Medicine Shop
Visit Buddha Tooth Relic Temple for Buddhist culture

Afternoon (1:00 PM - 6:00 PM)

Lunch at Maxwell Food Centre (try the famous Tian Tian Hainanese Chicken Rice)
Participate in a Traditional Tea Ceremony at Tea Chapter
Explore Tanjong Pagar conservation area - pre-war shophouses
Visit Red Dot Design Museum for contemporary Singaporean design

Evening (6:00 PM - 10:00 PM)

Fine dining at Burnt Ends (High-end Option) - Modern barbecue with local influences
Walk through Boat Quay for evening riverside ambiance

Day 4: Off-the-Beaten-Path & Natural Heritage
Morning (9:00 AM - 1:00 PM)

Visit Lazarus Island by ferry (small crowds, pristine beaches)
Explore the island's natural heritage and former quarantine history
Pack a picnic lunch

Afternoon (1:00 PM - 5:00 PM)

Return to mainland
Visit Haw Par Villa - eccentric theme park showcasing Chinese mythology
Explore Kent Ridge Park and Reflections at Bukit Chandu (WWII memorial)

Evening (5:00 PM - 8:00 PM)

Farewell dinner at Lau Pa Sat (Telok Ayer Market) - Victorian-era hawker center
Try satay and other local specialties
Evening stroll along Marina Bay for city skyline views

Food Recommendations
Budget-Friendly Option: Old Airport Road Food Centre

What to try: Hainanese Chicken Rice (Tian Tian), Char Kway Teow, Laksa, Rojak
Price range: SGD 3-8 per dish
Why authentic: Established in 1972, consistently rated by locals as top hawker center

High-End Option: Burnt Ends

Cuisine: Modern Australian barbecue with Southeast Asian influences
Price range: SGD 200-300 per person
Why special: Uses local ingredients and traditional smoking techniques, Michelin-starred

Practical Tips
Best Times to Visit Locations:

Museums: 10 AM - 4 PM (avoid weekend crowds)
Hawker centers: 11 AM - 2 PM or 6 PM - 8 PM
Temples: Early morning or late afternoon
Islands: Morning departure to avoid afternoon heat

Transportation:

Purchase a Singapore Tourist Pass for unlimited public transport
Use the MRT (subway) system - efficient and connects all major areas
Grab (ride-hailing) for areas not well-served by public transport

Cultural Etiquette:

Remove shoes when entering temples and heritage houses
Dress modestly when visiting religious sites
Ask permission before photographing people
Return trays and utensils after eating at hawker centers (mandatory)

Opening Hours Note:
All recommended locations are open during suggested visiting hours. Museums typically open 10 AM - 6 PM, hawker centers operate 10 AM - 10 PM, and temples welcome visitors dawn to dusk.
This itinerary provides an authentic cultural immersion while avoiding overcrowded tourist traps, giving you genuine insights into Singapore's multicultural heritage and local way of life.
"""


async def create_voyaige_agent(tools):
	"""Create a utility agent using LangGraph's proper pattern."""
	llm = ChatBedrockConverse(
		model=os.getenv("ANTHROPIC_MODEL", "anthropic.claude-3-sonnet-20240229-v1:0"),
		temperature=0,
		region_name=os.getenv("DEFAULT_REGION"),
	)
	llm_with_tools = llm.bind_tools(tools)

	def planning_node(state: State):
		"""Plan a trip to Singapore"""
		message_history = state.get("messages")
		planning_prompt = """draft a vacation plan for a couple visiting singapore for 4 days and 3 nights. Offer a offbeat, cultural and exploratory itinerary which would give them a true sense of Singapore.
scoure the net and get a plan which has recommendations from authentic sources.
give them a list of good places to eat to taste the local food - 1 of which is cheap and 1 costly.
choose a suitable month and time.
ensure the itinerary is adjusted to traffic of people visiting certain locations and that every location is open at that time
choose a suitable time period and give me a day by day plan

Do not offer to do anything else once you generate the itinerary"""
		message_history = [*message_history, SystemMessage(content=planning_prompt)]
		response = llm.ainvoke(message_history)
		message_history = [*message_history, response, AIMessage(content="Would you like me to book the flights?")]
		return {"messages": message_history}

	async def chatbot(state: State):
		"""The 'agent' node. It calls the model with the current state."""
		response = await llm_with_tools.ainvoke(state["messages"])
		return {"messages": [response]}

	graph_builder = StateGraph(State)
	tool_node = ToolNode(tools=tools)
	graph_builder.add_node("planning", planning_node)
	graph_builder.add_node("chatbot", chatbot)
	graph_builder.add_node("tools", tool_node)

	graph_builder.add_edge(START, "planning")
	graph_builder.add_edge("planning", "chatbot")
	graph_builder.add_conditional_edges(
		"chatbot",
		tools_condition,
	)
	graph_builder.add_edge("tools", "chatbot")
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
						"/home/varun/projects/GrabHack-Hackathon/app/tools_mcp.py",
					],
					"transport": "stdio",
				},
			},
		)
		mcp_tools = await client.get_tools()
		agent = await create_voyaige_agent([*mcp_tools, trip_planning])

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
