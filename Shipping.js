import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countries } from "countries-list";
import { saveShippingInfo } from "../../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { toast } from "react-toastify";

// Helper function to validate shipping information
export const validateShipping = (shippingInfo) => {
    if (
        !shippingInfo.address ||
        !shippingInfo.city ||
        !shippingInfo.state ||
        !shippingInfo.country ||
        !shippingInfo.phoneNo ||
        !shippingInfo.postalCode
    ) {
        toast.error("Please fill in all the shipping information", {
            position: "bottom-center",
        });
        return false; // Indicate invalid input
    }
    return true; // Indicate valid input
};

// Helper function to validate phone number
export const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);

export default function Shipping() {
    const { shippingInfo={} } = useSelector((state) => state.cartState);

    const [address, setAddress] = useState(shippingInfo.address || "");
    const [city, setCity] = useState(shippingInfo.city || "");
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
    const [country, setCountry] = useState(shippingInfo.country || "");
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || "");
    const [state, setState] = useState(shippingInfo.state || "");

    const countryList = Object.values(countries);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        if (!validatePhone(phoneNo)) {
            toast.error("Invalid phone number format", { position: "bottom-center" });
            return;
        }

        const shippingDetails = { address, city, phoneNo, postalCode, country, state };
        if (!validateShipping(shippingDetails)) return;

        dispatch(saveShippingInfo(shippingDetails));
        navigate("/order/confirm");
    };

    return (
        <Fragment>
            <CheckoutSteps shipping />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="tel"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Select a Country
                                </option>
                                {countryList.map((country, i) => (
                                    <option key={i} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="State_field">State</label>
                            <input
                                type="text"
                                id="State_field"
                                className="form-control"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="text"
                                id="postal_code_field"
                                className="form-control"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}
