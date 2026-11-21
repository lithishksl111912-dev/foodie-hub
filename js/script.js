const foods = [
  {id:1,name:"South Indian Meals",category:"Meals",price:120,desc:"A homestyle meal with rice and sides.",img:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Masala Dosa",category:"Meals",price:85,desc:"Crispy dosa served with chutney and sambar.",img:"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Veg Burger",category:"Snacks",price:99,desc:"A delicious veggie patty with fresh toppings.",img:"https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Paneer Pizza",category:"Snacks",price:189,desc:"Cheesy pizza topped with paneer and peppers.",img:"https://images.unsplash.com/photo-151 pizza?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"French Fries",category:"Snacks",price:79,desc:"Golden, crispy and perfectly salted.",img:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Fresh Lime Soda",category:"Drinks",price:45,desc:"A refreshing sweet and tangy cooler.",img:"https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Cold Coffee",category:"Drinks",price:89,desc:"Chilled coffee with a smooth finish.",img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Veg Noodles",category:"Meals",price:130,desc:"Stir-fried noodles with crunchy vegetables.",img:"https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80"}
];
// Replace the two demo image URLs below if your browser cannot load them.
foods[3].img = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80";
foods[5].img = "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=80".replace("c釈","c");
const cart = {};
let activeCategory = "All";
const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const money = value => "₹" + value.toLocaleString("en-IN");

function renderMenu(){
  const term = document.getElementById("searchInput").value.trim().toLowerCase();
  const visible = foods.filter(food => (activeCategory === "All" || food.category === activeCategory) && (food.name.toLowerCase().includes(term) || food.desc.toLowerCase().includes(term)));
  menuGrid.innerHTML = visible.map(food => `
    <div class="col-sm-6 col-lg-3">
      <article class="card food-card">
        <img src="${food.img}" alt="${food.name}" loading="lazy" onerror="this.src='https://placehold.co/700x450/f8edda/5a4630?text=Foodie+Hub'">
        <div class="card-body d-flex flex-column">
          <span class="small text-secondary">${food.category}</span>
          <h5 class="fw-bold mt-1">${food.name}</h5>
          <p class="small text-secondary flex-grow-1">${food.desc}</p>
          <div class="d-flex justify-content-between align-items-center mt-2"><span class="food-price">${money(food.price)}</span><button class="btn btn-warning rounded-pill px-3" onclick="addToCart(${food.id})">Add +</button></div>
        </div>
      </article>
    </div>`).join("");
  document.getElementById("emptyMessage").classList.toggle("d-none", visible.length !== 0);
}
function addToCart(id){cart[id]=(cart[id]||0)+1;renderCart();showToast("Added to your cart!");}
function changeQty(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];renderCart();}
function renderCart(){
  const entries=Object.entries(cart);
  const count=entries.reduce((sum,[,qty])=>sum+qty,0);
  const total=entries.reduce((sum,[id,qty])=>sum+foods.find(f=>f.id===Number(id)).price*qty,0);
  cartCount.textContent=count;cartTotal.textContent=money(total);checkoutBtn.disabled=count===0;
  cartItems.innerHTML=entries.length?entries.map(([id,qty])=>{const f=foods.find(x=>x.id===Number(id));return `<div class="cart-row"><div><strong>${f.name}</strong><div class="small text-secondary">${money(f.price)} each</div></div><div class="text-end"><div class="fw-bold">${money(f.price*qty)}</div><div class="qty-controls mt-1"><button aria-label="Remove one ${f.name}" onclick="changeQty(${id},-1)">−</button><span>${qty}</span><button aria-label="Add one ${f.name}" onclick="changeQty(${id},1)">+</button></div></div></div>`}).join(""):'<p class="text-secondary">Your cart is empty.</p>';
}
function showToast(message){document.getElementById("toastMessage").textContent=message;bootstrap.Toast.getOrCreateInstance(document.getElementById("siteToast")).show();}
document.getElementById("searchInput").addEventListener("input",renderMenu);
document.getElementById("categoryButtons").addEventListener("click",event=>{const btn=event.target.closest("button[data-category]");if(!btn)return;activeCategory=btn.dataset.category;document.querySelectorAll(".category-btn").forEach(b=>b.classList.toggle("active",b===btn));renderMenu();});
checkoutBtn.addEventListener("click",()=>{bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("cartPanel")).hide();bootstrap.Modal.getOrCreateInstance(document.getElementById("orderModal")).show();});
document.getElementById("orderForm").addEventListener("submit",event=>{event.preventDefault();if(!event.target.reportValidity())return;const orderId="FH"+Math.floor(100000+Math.random()*900000);bootstrap.Modal.getOrCreateInstance(document.getElementById("orderModal")).hide();alert(`Thank you, ${document.getElementById("customerName").value}! Your demo order ${orderId} has been created. This is not a real order.`);Object.keys(cart).forEach(id=>delete cart[id]);renderCart();event.target.reset();});
renderMenu();renderCart();
