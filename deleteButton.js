const Ulist = document.getElementById('ulist');
const API_URL = "https://crudcrud.com/api/fbbe569d9de3428f8983c6dd2803a010/test";

// 1. Page load पर existing items ला के दिखाओ
window.addEventListener('DOMContentLoaded', () => {
  axios.get(API_URL)
    .then(res => res.data.forEach(item => showItem(item)))
    .catch(err => console.error(err));
});

// 2. Form submit हेंडल करो
document.getElementById('formAddItem')
  .addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  const items = {
    itemName:    document.getElementById('item').value,
    description: document.getElementById('description').value,
    price:       document.getElementById('price').value,
    quantity:    +document.getElementById('quantity').value,
  };

  axios.post(API_URL, items)
    .then(res => showItem(res.data))
    .catch(err => console.error(err));

  event.target.reset();
}

// 3. LI बनाने और बटन attach करने का function
function showItem(data) {
  // अगर पहले से exist कर रहा हो (page reload) तो remove करके फिर add करें
  const existing = document.getElementById(data._id);
  if (existing) existing.remove();

  const li = document.createElement('li');
  li.id = data._id;
  li.textContent = `${data.itemName} — ${data.description} — ₹${data.price} — Qty: ${data.quantity}`;

  // तीनों बटन label और decrement value के साथ
  const buys = [
    { label: 'Buy1', qty: 1 },
    { label: 'Buy2', qty: 2 },
    { label: 'Buy3', qty: 3 },
  ];

  buys.forEach(b => {
    const btn = document.createElement('button');
    btn.textContent = b.label;
    btn.addEventListener('click', () => handleBuy(data, b.qty));
    li.appendChild(btn);
  });

  Ulist.appendChild(li);
}

// 4. Buy handler: quantity घटाओ + PUT करके update करो + UI refresh
function handleBuy(item, decrement) {
  const newQty = item.quantity - decrement;
  if (newQty < 0) {
    alert(`Cannot buy ${decrement}. Only ${item.quantity} left!`);
    return;
  }

  const updated = { ...item, quantity: newQty };
  // PUT request to update on server
  axios.put(`${API_URL}/${item._id}`, updated)
    .then(() => {
      // server पर update हो गया, UI refresh
      showItem(updated);
      // local item reference भी अपडेट कर लो
      item.quantity = newQty;
    })
    .catch(err => console.error(err));
}
