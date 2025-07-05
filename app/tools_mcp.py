# server.py
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


if __name__ == "__main__":
    mcp.run()  # Default: uses STDIO transport
