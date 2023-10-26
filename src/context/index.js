"use client";

import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

export const initialCheckoutFormData = {
  shippingAddress: {},
  paymentMethod: "",
  totalPrice: 0,
  isPaid: false,
  paidAt: new Date(),
  isProcessing: true,
};

const protectedRoutes = ["cart", "checkout", "account", "orders", "admin-view"];

const protectedAdminRoutes = [
  "/admin-view",
  "/admin-view/add-product",
  "/admin-view/all-products",
];

export default function GlobalState({ children }) {
  const [showNavModal, setshowNavModal] = useState(false);
  const [pageLevelLoader, setpageLevelLoader] = useState(false);
  const [componentLevelLoader, setcomponentLevelLoader] = useState({
    loading: false,
    id: "",
  });
  const [isAuthUser, setisAuthUser] = useState(null);
  const [user, setuser] = useState(null);
  const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    city: "",
    country: "",
    postalCode: "",
    address: "",
  });

  const [checkoutFormData, setCheckoutFormData] = useState(
    initialCheckoutFormData
  );

  const [allOrdersForUser, setAllOrdersForUser] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [allOrdersForAllUsers, setAllOrdersForAllUsers] = useState([]);

  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (Cookies.get("token") !== undefined) {
      setisAuthUser(true);
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const getCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(getCartItems);
      setuser(userData);
    } else {
      setisAuthUser(false);
      setuser({}); // unauthenticated user
    }
  }, [Cookies]);

  useEffect(() => {
    if (
      pathName !== "/register" &&
      !pathName.includes("product") &&
      pathName !== "/" &&
      user &&
      Object.keys(user).length === 0 &&
      protectedRoutes.includes(pathName) > -1
    )
      router.push("/login");
  }, [user, pathName]);

  useEffect(() => {
    if (
      user !== null &&
      user &&
      Object.keys(user).length > 0 &&
      user.role !== "admin" &&
      protectedAdminRoutes.indexOf(pathName) > -1
    )
      router.push("/unauthorized-page");
  }, [user, pathName]);

  return (
    <GlobalContext.Provider
      value={{
        showNavModal,
        setshowNavModal,
        pageLevelLoader,
        setpageLevelLoader,
        isAuthUser,
        setisAuthUser,
        user,
        setuser,
        componentLevelLoader,
        setcomponentLevelLoader,
        currentUpdatedProduct,
        setCurrentUpdatedProduct,
        showCartModal,
        setShowCartModal,
        cartItems,
        setCartItems,
        addresses,
        setAddresses,
        addressFormData,
        setAddressFormData,
        checkoutFormData,
        setCheckoutFormData,
        allOrdersForUser,
        setAllOrdersForUser,
        orderDetails,
        setOrderDetails,
        allOrdersForAllUsers,
        setAllOrdersForAllUsers,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
