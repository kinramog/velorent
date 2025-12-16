import { API_ROUTES } from "@/src/lib/routes";
import { authFetch } from "@/src/lib/authFetch";
import { CreateRentalDto } from "../interfaces/create-rental.interface";

export async function createRental(
    data: CreateRentalDto
) {
    const res = await authFetch(API_ROUTES.RENTALS.CREATE, {
        method: "POST",
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        throw result;
    }

    return result;
}
