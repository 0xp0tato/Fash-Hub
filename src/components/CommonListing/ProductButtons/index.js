"use client";

import ComponentLevelLoader from "@/components/Loader/componentlevel";
import { GlobalContext } from "@/context";
import { addToCart } from "@/services/cart";
import { deleteAProduct } from "@/services/product";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function ProductButton({ item }) {
  const pathName = usePathname();
  const {
    setCurrentUpdatedProduct,
    setcomponentLevelLoader,
    componentLevelLoader,
    user,
    showCartModal,
    setShowCartModal,
  } = useContext(GlobalContext);

  const router = useRouter();

  const isAdminView = pathName.includes("admin-view");

  async function handleDeleteProduct(item) {
    setcomponentLevelLoader({ loading: true, id: item._id });
    const res = await deleteAProduct(item._id);

    if (res.success) {
      setcomponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      router.refresh();
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setcomponentLevelLoader({ loading: false, id: "" });
    }
  }

  async function handleAddToCart(getItem) {
    setcomponentLevelLoader({ loading: true, id: getItem._id });

    const res = await addToCart({ productID: getItem._id, userID: user._id });

    if (res.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setcomponentLevelLoader({ loading: false, id: "" });
      setShowCartModal(true);
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setcomponentLevelLoader({ loading: false, id: "" });
      setShowCartModal(true);
    }

    console.log(res);
  }

  return isAdminView ? (
    <>
      <button
        onClick={() => {
          setCurrentUpdatedProduct(item);
          router.push("/admin-view/add-product");
        }}
        className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
      >
        Update
      </button>
      <button
        onClick={() => handleDeleteProduct(item)}
        className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
      >
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        item._id === componentLevelLoader.id ? (
          <ComponentLevelLoader
            text={"Deleting Product"}
            loading={componentLevelLoader && componentLevelLoader.loading}
            color={"#ffffff"}
          />
        ) : (
          "Delete"
        )}
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => handleAddToCart(item)}
        className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
      >
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        componentLevelLoader.id === item._id ? (
          <ComponentLevelLoader
            text={"Adding to cart"}
            loading={componentLevelLoader && componentLevelLoader.loading}
            color={"#ffffff"}
          />
        ) : (
          "Add To Cart"
        )}
      </button>
    </>
  );
}
