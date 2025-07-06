# server.py
from embeddings_rag import search_faq
from fastmcp import FastMCP

mcp = FastMCP("Voyaige")


@mcp.tool
def book_flight(
	number_of_passengers: int,
	origin: str,
	departure_date: str,
	arrival_date: str,
	flight_type: str,
) -> str:
	"""Book a flight to .

	Args:
	    number_of_passengers: The number of passengers to book a flight for.
	    origin: The origin of the flight.
	    departure_date: The date of the departure.
	    arrival_date: The date of the arrival.
	    flight_type: The type of flight to book.
	"""
	if not number_of_passengers:
		return "Please provide the number of passengers to book a flight for."
	if not origin:
		return "Please provide the origin of the flight."
	if not departure_date:
		return "Please provide the date of the departure."
	if not arrival_date:
		return "Please provide the date of the arrival."
	if flight_type not in ["Flight 1620E", "Flight 1630D", "Flight 3410D"]:
		return """We have 3 flights available for your requirements:

Flight 1620E:
- Departure: 9:00 AM
- Arrival: 12:00 PM
- Price: $100
- Availability: 10 seats

Flight 1630D:
- Departure: 1:00 PM
- Arrival: 5:00 PM
- Price: $120
- Availability: 10 seats

Flight 3410D:
- Departure: 11:00 PM
- Arrival: 2:00 AM
- Price: $140
- Availability: 10 seats

Which one would you like to book?"""

	return f"""
Booked {flight_type} flight from {origin} to Singapore for {number_of_passengers} passengers on {departure_date} and {arrival_date}
Ask the user if they would like to insure their trip with Grab's Travel Cover?"""


@mcp.tool()
async def search_travel_cover(query: str) -> str:
	"""
	Official policy document for Chubb Travel Cover insurance (Nov 2021).
	Used by the MCP tool to extract coverage details, interpret user insurance queries,
	and recommend relevant travel protection options like trip cancellation, medical,
	or COVID-19 cover during booking workflows.

	Args:
	    query: The query to search for.
	"""
	return search_faq(query)


@mcp.tool
def avail_travel_cover() -> str:
	"""Opt in for travel cover - Grab's vacation insurance policy."""

	return "You have insured your trip with Grab's Travel Cover. Ask the user if they would like to book a taxi."


@mcp.tool
def book_taxi(
	type_of_vehicle: str,
	start_location: str,
	end_location: str,
	date_of_travel: str,
) -> str:
	"""Book a cab to a given destination.

	Args:
	    type_of_vehicle: The type of vehicle to book.
	    start_location: The start location of the vehicle.
	    end_location: The end location of the vehicle.
	    date_of_travel: The date of the travel for the taxi.
	"""
	if not type_of_vehicle:
		return "Please provide the type of vehicle to book."
	if not start_location:
		return "Please provide the start location of the vehicle."
	if not end_location:
		return "Please provide the end location of the vehicle."
	if not date_of_travel:
		return "Please provide the date of the travel for the taxi."

	return f"Booked a {type_of_vehicle} from {start_location} to {end_location} on {date_of_travel}."


@mcp.tool()
async def search_ride_cover(query: str) -> str:
	"""Search through Grab's Ride Cover official policy documents to answer queries related to Grab RideCover

	Args:
	    query: The query to search for.
	"""
	return search_faq(query)


@mcp.tool
def avail_ride_cover() -> str:
	"""Opt in for ride cover - Grab's taxi ride insurance policy."""

	return "You have insured your ride with Grab's Ride Cover. Ask the user if they would like to make the payment."


@mcp.tool()
async def search_payment_faq(query: str) -> str:
	"""Search through GrabPay's FAQ to answer queries related to GrabPay

	Args:
	    query: The query to search for.
	"""
	return search_faq(query)


@mcp.tool
def get_payment_link() -> str:
	"""Get the payment link for the user."""

	return "Here is your payment link: <a href='#' class='grabpay-link'>http://grab.com/payment/id=782y49</a>"


if __name__ == "__main__":
	mcp.run()  # Default: uses STDIO transport
