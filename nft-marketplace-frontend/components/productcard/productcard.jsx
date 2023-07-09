import Style from "./productcard.module.css";

function ProductCard({ product }) {
    return (
        <div className={Style.product_Card}>
            <div className={Style.product_Image}>
                <img src={product.images[0]} alt={product.name} />
            </div>
            <div className={Style.product_info}>
                <div className={Style.product_name}>{product.title}</div>
                <div className={Style.product_price}>${product.price}</div>
                <div className={Style.product_collection}>{product.title}</div>
                <div className={Style.product_rating}></div>
            </div>
        </div>
    );
}

export default ProductCard;
