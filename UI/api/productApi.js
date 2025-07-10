import { PRODUCT_API } from "../src/config/api";

export async function getAllProducts() {
  const response = await fetch(`${PRODUCT_API}/get-all-products`);

  if (!response.ok) {
    throw new Error(`Lỗi ${response.status}: Không thể truy xuất sản phẩm`);
  }

  return await response.json();
}
