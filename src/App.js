import "./App.css";
import { useState } from "react";

/**
 * Basic details of the items ... name, price and promotion type & on discount
 */
const items = [
  {
    itemName: "A",
    price: 50,
    promotion: { type: "nItem", count: 3, discount: 20 },
  },
  {
    itemName: "B",
    price: 30,
    promotion: { type: "nItem", count: 2, discount: 15 },
  },
  {
    itemName: "C",
    price: 20,
    promotion: { type: "combo", comboItem: "D", discount: 5 },
  },
  {
    itemName: "D",
    price: 15,
    promotion: { type: "combo", comboItem: "C", discount: 5 },
  },
];

/**
 * Main App component to list out items, Discount and Total
 */
function App() {
  const varingObj = { count: 0, discount: 0, total: 0 };
  const [cartItems, setCartItems] = useState(
    items.map((i) => ({ ...i, ...varingObj }))
  );
  const [discountTotal, setDiscountTotal] = useState(0);
  const [totalSub, setTotalSub] = useState(0);
  const [amoutToPay, setAmountToPay] = useState(0);

  /**
   * Promotion engine function responcibe for calculation of total and discounted price
   */
  const promoEngine = (itemName, changeVal) => {
    let total = 0,
      discTot = 0;
    const combo = {},
      items = cartItems.map((item) => {
        if (item.itemName === itemName)
          item.count = Number(changeVal) > 0 ? Number(changeVal) : 0;
        item.total = item.price * item.count;

        //promo handal of type on 'n' items
        if (item.promotion.type === "nItem")
          item.discount =
            Math.floor(item.count / item.promotion.count) *
            item.promotion.discount;

        //promo handal of type of combo items
        if (item.promotion.type === "combo") {
          item.discount = 0;
          if (item.count) {
            combo[item.itemName] = item.count;
            item.discount = combo[item.promotion.comboItem]
              ? item.promotion.discount *
                Math.min(combo[item.promotion.comboItem], combo[item.itemName])
              : 0;
          }
        }

        total += item.total;
        discTot += item.discount;
        return item;
      });

    setCartItems(items);
    setTotalSub(total);
    setDiscountTotal(discTot);
    setAmountToPay(total - discTot);
  };

  /**
   * Item component
   * @param {*} props
   */
  const Item = (props) => {
    return (
      <tr>
        <th scope="row">{props.index + 1}</th>
        <td>{props.itemName}</td>
        <td className="form-inline">
          <div className="col-auto my-1">
            <button
              className="btn btn-primary"
              onClick={() => promoEngine(props.itemName, props.itemCount - 1)}
            >
              -
            </button>
          </div>
          <input
            type="text"
            className="form-control select-width"
            value={props.itemCount}
            onChange={(e) => promoEngine(props.itemName, e.target.value)}
          />
          <div className="col-auto my-1">
            <button
              className="btn btn-primary"
              onClick={() => promoEngine(props.itemName, props.itemCount + 1)}
            >
              +
            </button>
          </div>
        </td>
        <td className="text-right">{props.price}$</td>
        <td className="text-right">{props.total}$</td>
        <td className="text-right">- {props.discount}$</td>
        <td className="text-right">{props.total - props.discount}$</td>
      </tr>
    );
  };

  return (
    <main role="main" className="container">
      <div className="starter-template">
        <h1>Bulu Cart</h1>
        <div className="lead">
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Item</th>
                <th scope="col">Quantity</th>
                <th scope="col" className="text-right">
                  Unit Price
                </th>
                <th scope="col" className="text-right">
                  Total
                </th>
                <th scope="col" className="text-right">
                  Discount
                </th>
                <th scope="col" className="text-right">
                  After discount
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <Item
                  key={index}
                  index={index}
                  itemName={item.itemName}
                  type={item.promotion.type}
                  itemCount={item.count}
                  discount={item.discount}
                  price={item.price}
                  total={item.total}
                />
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-primary">
                <td className="text-right font-weight-bold" colSpan="4">
                  Total
                </td>
                <td className="text-right">{totalSub}$</td>
                <td className="text-right">- {discountTotal}$</td>
                <td className="text-right">{totalSub - discountTotal}$</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="lead">
          <div className="mt-5 d-flex flex-row-reverse">
            <div className="p-2 amout-width text-right">{totalSub}$</div>
            <div className="p-2">Total Price: </div>
          </div>
          <div className="d-flex flex-row-reverse">
            <div className="p-2 amout-width text-right">- {discountTotal}$</div>
            <div className="p-2">Total Discount: </div>
          </div>
          <hr />
          <div className="d-flex flex-row-reverse font-weight-bold">
            <div className="p-2 amout-width text-right">{amoutToPay}$</div>
            <div className="p-2">Total Amount to pay: </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
