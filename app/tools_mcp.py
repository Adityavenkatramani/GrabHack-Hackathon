# server.py
from embeddings_rag import search_faq
from fastmcp import FastMCP

mcp = FastMCP("Voyaige")


@mcp.tool
def book_flight(
    number_of_passengers: int,
    origin: str,
    destination: str,
    departure_date: str,
    arrival_date: str,
) -> str:
    """Book a flight to a given destination.

    Args:
        number_of_passengers: The number of passengers to book a flight for.
        origin: The origin of the flight.
        destination: The destination of the flight.
        departure_date: The date of the departure.
        arrival_date: The date of the arrival.
    """
    if not number_of_passengers:
        return "Please provide the number of passengers to book a flight for."
    if not origin:
        return "Please provide the origin of the flight."
    if not destination:
        return "Please provide the destination of the flight."
    if not departure_date:
        return "Please provide the date of the departure."
    if not arrival_date:
        return "Please provide the date of the arrival."

    return f"Booked a flight to {destination} for {number_of_passengers} passengers on {departure_date}."


@mcp.tool()
async def search_payment_faq(query: str) -> str:
    """Search through SBI Knowledge base"""
    return search_faq(query)


@mcp.tool()
async def search_ride_cover_personal_accident(query: str) -> str:
    """Search through Ride cover for personal accidents"""
    return search_faq(query)


@mcp.tool()
async def search_travel_cover(query: str) -> str:
    """Official policy document for Chubb Travel Cover insurance (Nov 2021).
    Used by the MCP tool to extract coverage details, interpret user insurance queries,
     and recommend relevant travel protection options like trip cancellation, medical,
       or COVID-19 cover during booking workflows.
    """
    return search_faq(query)


@mcp.tool()
async def get_payment_link() -> str:
    """Return payment link for checkout."""
    return "http://grab.com/payment/id=782y49"


@mcp.tool
def travel_cover(
    user_opt_in: bool,
) -> str:
    """Opt in for travel cover - Grab's vacation insurance policy.

    Args:
        user_opt_in: Check whether the user has opted in to get a travel cover.
    """
    if not user_opt_in:
        return "Please provide the user opt in to get a travel cover."

    return "You have availed the travel cover."


@mcp.tool
def grab_taxi(
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
        date_of_travel: The date of the travel.
    """
    if not type_of_vehicle:
        return "Please provide the type of vehicle to book."
    if not start_location:
        return "Please provide the start location of the vehicle."
    if not end_location:
        return "Please provide the end location of the vehicle."
    if not date_of_travel:
        return "Please provide the date of the travel."

    return f"Booked a {type_of_vehicle} from {start_location} to {end_location} on {date_of_travel}."


@mcp.tool
def ride_cover(
    user_opt_in: bool,
) -> str:
    """Opt in for ride cover - Grab's taxi ride insurance policy.

    Args:
        user_opt_in: Check whether the user has opted in to get a ride cover.
    """

    return "You have availed the ride cover."


@mcp.tool
def grab_pay(
    user_intent: str,
) -> str:
    """Make a payment using GrabPay - Grab's mobile payment platform.

    Args:
        user_intent: The intent of the user to make a payment.
    """

    return "Here is the payment link: https://payment-link.grab.com/pay/1234567890"


if __name__ == "__main__":
    mcp.run()  # Default: uses STDIO transport
