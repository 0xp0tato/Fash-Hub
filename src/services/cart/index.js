import Cookies from "js-cookie";
import { server } from "../../config";

export const addToCart = async (formData) => {
  try {
    const res = await fetch("/api/cart/add-to-cart", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    console.log(res);

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getAllCartItems = async (id) => {
  try {
    const res = await fetch(`${server}/api/cart/all-cart-items?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteFromCart = async (id) => {
  try {
    const res = await fetch(`/api/cart/delete-from-cart?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};
