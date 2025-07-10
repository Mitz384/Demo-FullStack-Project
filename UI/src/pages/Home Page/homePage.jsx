import { useState, useEffect, useRef } from "react";
import { getAllProducts } from "../../../api/productApi";
import { useSearchParams, useNavigate } from "react-router-dom";

function homePage() {
  const [products, setProducts] = useState(null);
  const [searchParams] = useSearchParams();
  const hasAlerted = useRef(false);
  const navigate = useNavigate();

  // Check logout
  useEffect(() => {
    const logout = searchParams.get("logout");
    if (!hasAlerted.current && logout) {
      console.log("Đã đăng xuất thành công");
      hasAlerted.current = true;
    }
    navigate(window.location.pathname, { replace: true });
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        const priceProducts = allProducts.map((product) => ({
          ...product,
          price: product.price.toLocaleString("vi-VN"),
        }));
        setProducts(priceProducts);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProducts();
  }, []);

  return products ? (
    <div className="px-6 py-4">
      <h1 className="text-6xl font-bold text-orange-400 text-center mb-[5rem]">
        Home Page
      </h1>
      <ul className="grid grid-cols-3 gap-4 w-fit mx-auto">
        {products.map((product) => (
          <li
            key={product.id}
            className="cursor-pointer hover:bg-orange-200 p-4 bg-orange-100 rounded-xl flex flex-col gap-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] object-contain rounded-2xl"
            />
            <div>
              <p>{product.name}</p>
              <p className="text-red-500 font-semibold text-xl">
                {product.price} VND
              </p>
            </div>
            <br />
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Loading products...</p>
  );
}

export default homePage;
