import { PRODUCT_IDS, products } from "./features/product";
import { CloseIcon, Header, InfoIcon } from "./shared/components";

let bonusPts = 0;
let stockInfo;
let itemCnt;
let lastSel;
let sel;
let addBtn;
let totalAmt = 0;
let cartDisp;
let sum;

function onUpdateSelectOptions() {
	let totalStock;
	let opt;
	let discountText;

	sel.innerHTML = "";
	totalStock = 0;

	for (let idx = 0; idx < products.length; idx++) {
		const _p = products[idx];
		totalStock = totalStock + _p.q;
	}

	for (let i = 0; i < products.length; i++) {
		(function () {
			const item = products[i];

			opt = document.createElement("option");
			opt.value = item.id;
			discountText = "";

			if (item.onSale) discountText += " ⚡SALE";
			if (item.suggestSale) discountText += " 💝추천";
			if (item.q === 0) {
				opt.textContent = `${item.name} - ${item.val}원 (품절)${discountText}`;
				opt.disabled = true;
				opt.className = "text-gray-400";
			} else {
				if (item.onSale && item.suggestSale) {
					opt.textContent = `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)`;
					opt.className = "text-purple-600 font-bold";
				} else if (item.onSale) {
					opt.textContent = `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)`;
					opt.className = "text-red-500 font-bold";
				} else if (item.suggestSale) {
					opt.textContent = `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)`;
					opt.className = "text-blue-500 font-bold";
				} else {
					opt.textContent = `${item.name} - ${item.val}원${discountText}`;
				}
			}
			sel.appendChild(opt);
		})();
	}

	if (totalStock < 50) {
		sel.style.borderColor = "orange";
	} else {
		sel.style.borderColor = "";
	}
}

function handleCalculateCartStuff() {
	const cartItems = cartDisp.children;
	const itemDiscounts = [];
	const summaryDetails = document.getElementById("summary-details");
	const totalDiv = sum.querySelector(".text-2xl");
	const loyaltyPointsDiv = document.getElementById("loyalty-points");
	const discountInfoDiv = document.getElementById("discount-info");
	const itemCountElement = document.getElementById("item-count");

	let subTot = 0;
	let savedAmount;
	let points;
	let previousCount;
	let stockMsg;

	totalAmt = 0;
	itemCnt = 0;

	for (let i = 0; i < cartItems.length; i++) {
		(function () {
			let curItem;

			for (let j = 0; j < products.length; j++) {
				if (products[j].id === cartItems[i].id) {
					curItem = products[j];
					break;
				}
			}

			const qtyElem = cartItems[i].querySelector(".quantity-number");
			const q = parseInt(qtyElem.textContent);
			const itemTot = curItem.val * q;
			let disc;

			disc = 0;
			itemCnt += q;
			subTot += itemTot;

			const itemDiv = cartItems[i];
			const priceElems = itemDiv.querySelectorAll(".text-lg, .text-xs");

			priceElems.forEach(function (elem) {
				if (elem.classList.contains("text-lg")) {
					elem.style.fontWeight = q >= 10 ? "bold" : "normal";
				}
			});

			if (q >= 10) {
				switch (curItem.id) {
					case PRODUCT_IDS.KEYBOARD:
						disc = 10 / 100;
						break;
					case PRODUCT_IDS.MOUSE:
						disc = 15 / 100;
						break;
					case PRODUCT_IDS.MONITOR_ARM:
						disc = 20 / 100;
						break;
					case PRODUCT_IDS.LAPTOP_POUCH:
						disc = 5 / 100;
						break;
					case PRODUCT_IDS.SPEAKER:
						disc = 25 / 100;
						break;
				}

				if (disc > 0) {
					itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
				}
			}
			totalAmt += itemTot * (1 - disc);
		})();
	}

	let discRate = 0;
	const originalTotal = subTot;

	if (itemCnt >= 30) {
		totalAmt = (subTot * 75) / 100;
		discRate = 25 / 100;
	} else {
		discRate = (subTot - totalAmt) / subTot;
	}

	const today = new Date();
	const isTuesday = today.getDay() === 2;
	const tuesdaySpecial = document.getElementById("tuesday-special");

	if (isTuesday) {
		if (totalAmt > 0) {
			totalAmt = (totalAmt * 90) / 100;
			discRate = 1 - totalAmt / originalTotal;
			tuesdaySpecial.classList.remove("hidden");
		} else {
			tuesdaySpecial.classList.add("hidden");
		}
	} else {
		tuesdaySpecial.classList.add("hidden");
	}

	document.getElementById("item-count").textContent = `🛍️ ${itemCnt} items in cart`;
	summaryDetails.innerHTML = "";

	if (subTot > 0) {
		for (let i = 0; i < cartItems.length; i++) {
			let curItem;

			for (let j = 0; j < products.length; j++) {
				if (products[j].id === cartItems[i].id) {
					curItem = products[j];
					break;
				}
			}

			const qtyElem = cartItems[i].querySelector(".quantity-number");
			const q = parseInt(qtyElem.textContent);
			const itemTotal = curItem.val * q;

			summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
		}

		summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

		if (itemCnt >= 30) {
			summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
		} else if (itemDiscounts.length > 0) {
			itemDiscounts.forEach(function (item) {
				summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
			});
		}

		if (isTuesday) {
			if (totalAmt > 0) {
				summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
			}
		}
		summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
	}

	if (totalDiv) {
		totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
	}

	if (loyaltyPointsDiv) {
		points = Math.floor(totalAmt / 1000);
		if (points > 0) {
			loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
			loyaltyPointsDiv.style.display = "block";
		} else {
			loyaltyPointsDiv.textContent = "적립 포인트: 0p";
			loyaltyPointsDiv.style.display = "block";
		}
	}

	discountInfoDiv.innerHTML = "";
	if (discRate > 0 && totalAmt > 0) {
		savedAmount = originalTotal - totalAmt;
		discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
	}

	if (itemCountElement) {
		previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
		itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
		if (previousCount !== itemCnt) {
			itemCountElement.setAttribute("data-changed", "true");
		}
	}

	stockMsg = "";
	for (let stockIdx = 0; stockIdx < products.length; stockIdx++) {
		const item = products[stockIdx];
		if (item.q < 5) {
			if (item.q > 0) {
				stockMsg = `${stockMsg + item.name}: 재고 부족 (${item.q}개 남음)\n`;
			} else {
				stockMsg = `${stockMsg + item.name}: 품절\n`;
			}
		}
	}

	stockInfo.textContent = stockMsg;
	handleStockInfoUpdate();
	doRenderBonusPoints();
}

const doRenderBonusPoints = function () {
	const basePoints = Math.floor(totalAmt / 1000);
	const pointsDetail = [];
	const nodes = cartDisp.children;

	let finalPoints = 0;
	let hasKeyboard = false;
	let hasMouse = false;
	let hasMonitorArm = false;

	if (cartDisp.children.length === 0) {
		document.getElementById("loyalty-points").style.display = "none";
		return;
	}

	if (basePoints > 0) {
		finalPoints = basePoints;
		pointsDetail.push(`기본: ${basePoints}p`);
	}

	if (new Date().getDay() === 2) {
		if (basePoints > 0) {
			finalPoints = basePoints * 2;
			pointsDetail.push("화요일 2배");
		}
	}

	for (const node of nodes) {
		let product = null;

		for (let pIdx = 0; pIdx < products.length; pIdx++) {
			if (products[pIdx].id === node.id) {
				product = products[pIdx];
				break;
			}
		}

		if (!product) continue;

		switch (product.id) {
			case PRODUCT_IDS.KEYBOARD:
				hasKeyboard = true;
				break;
			case PRODUCT_IDS.MOUSE:
				hasMouse = true;
				break;
			case PRODUCT_IDS.MONITOR_ARM:
				hasMonitorArm = true;
				break;
		}
	}

	if (hasKeyboard && hasMouse) {
		finalPoints = finalPoints + 50;
		pointsDetail.push("키보드+마우스 세트 +50p");
	}

	if (hasKeyboard && hasMouse && hasMonitorArm) {
		finalPoints = finalPoints + 100;
		pointsDetail.push("풀세트 구매 +100p");
	}

	if (itemCnt >= 30) {
		finalPoints = finalPoints + 100;
		pointsDetail.push("대량구매(30개+) +100p");
	} else {
		if (itemCnt >= 20) {
			finalPoints = finalPoints + 50;
			pointsDetail.push("대량구매(20개+) +50p");
		} else {
			if (itemCnt >= 10) {
				finalPoints = finalPoints + 20;
				pointsDetail.push("대량구매(10개+) +20p");
			}
		}
	}

	bonusPts = finalPoints;
	const ptsTag = document.getElementById("loyalty-points");
	if (ptsTag) {
		if (bonusPts > 0) {
			ptsTag.innerHTML =
				`<div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>` +
				`<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(", ")}</div>`;
			ptsTag.style.display = "block";
		} else {
			ptsTag.textContent = "적립 포인트: 0p";
			ptsTag.style.display = "block";
		}
	}
};

const handleStockInfoUpdate = function () {
	let infoMsg = "";

	products.forEach(function (item) {
		if (item.q < 5) {
			if (item.q > 0) {
				infoMsg = `${infoMsg + item.name}: 재고 부족 (${item.q}개 남음)\n`;
			} else {
				infoMsg = `${infoMsg + item.name}: 품절\n`;
			}
		}
	});

	stockInfo.textContent = infoMsg;
};

function doUpdatePricesInCart() {
	const cartItems = cartDisp.children;

	for (let i = 0; i < cartItems.length; i++) {
		const itemId = cartItems[i].id;
		let product = null;

		for (let productIdx = 0; productIdx < products.length; productIdx++) {
			if (products[productIdx].id === itemId) {
				product = products[productIdx];
				break;
			}
		}

		if (product) {
			const priceDiv = cartItems[i].querySelector(".text-lg");
			const nameDiv = cartItems[i].querySelector("h3");

			if (product.onSale && product.suggestSale) {
				priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
				nameDiv.textContent = `⚡💝${product.name}`;
			} else if (product.onSale) {
				priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
				nameDiv.textContent = `⚡${product.name}`;
			} else if (product.suggestSale) {
				priceDiv.innerHTML = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
				nameDiv.textContent = `💝${product.name}`;
			} else {
				priceDiv.textContent = `₩${product.val.toLocaleString()}`;
				nameDiv.textContent = product.name;
			}
		}
	}
	handleCalculateCartStuff();
}

function main() {
	const root = document.getElementById("app");

	// selectorContainer
	const selectorContainer = document.createElement("div");
	selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";

	sel = document.createElement("select");
	sel.id = "product-select";
	sel.className = "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";

	addBtn = document.createElement("button");
	addBtn.id = "add-to-cart";
	addBtn.innerHTML = "Add to Cart";
	addBtn.className =
		"w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";

	stockInfo = document.createElement("div");
	stockInfo.id = "stock-status";
	stockInfo.className = "text-xs text-red-500 mt-3 whitespace-pre-line";

	selectorContainer.appendChild(sel);
	selectorContainer.appendChild(addBtn);
	selectorContainer.appendChild(stockInfo);

	// leftColumn
	const leftColumn = document.createElement("div");
	leftColumn["className"] = "bg-white border border-gray-200 p-8 overflow-y-auto";
	leftColumn.appendChild(selectorContainer);

	cartDisp = document.createElement("div");
	cartDisp.id = "cart-items";

	leftColumn.appendChild(cartDisp);

	// rightColumn
	const rightColumn = document.createElement("div");
	rightColumn.className = "bg-black text-white p-8 flex flex-col";
	rightColumn.innerHTML = /* HTML */ `
		<h2 class="tracking-extra-wide mb-5 text-xs font-medium uppercase">Order Summary</h2>
		<div class="flex flex-1 flex-col">
			<div id="summary-details" class="space-y-3"></div>
			<div class="mt-auto">
				<div id="discount-info" class="mb-4"></div>
				<div id="cart-total" class="border-t border-white/10 pt-5">
					<div class="flex items-baseline justify-between">
						<span class="text-sm uppercase tracking-wider">Total</span>
						<div class="text-2xl tracking-tight">₩0</div>
					</div>
					<div id="loyalty-points" class="mt-2 text-right text-xs text-blue-400">
						적립 포인트: 0p
					</div>
				</div>
				<div id="tuesday-special" class="mt-4 hidden rounded-lg bg-white/10 p-3">
					<div class="flex items-center gap-2">
						<span class="text-2xs">🎉</span>
						<span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
					</div>
				</div>
			</div>
		</div>
		<button
			class="tracking-super-wide mt-6 w-full cursor-pointer bg-white py-4 text-sm font-normal uppercase text-black transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
		>
			Proceed to Checkout
		</button>
		<p class="text-2xs mt-4 text-center leading-relaxed text-white/60">
			Free shipping on all orders.<br />
			<span id="points-notice">Earn loyalty points with purchase.</span>
		</p>
	`;

	sum = rightColumn.querySelector("#cart-total");

	// manual
	const manualToggle = document.createElement("button");
	manualToggle.onclick = function () {
		manualOverlay.classList.toggle("hidden");
		manualColumn.classList.toggle("translate-x-full");
	};
	manualToggle.className =
		"fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50";
	manualToggle.innerHTML = InfoIcon();

	const manualOverlay = document.createElement("div");
	manualOverlay.className = "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";
	manualOverlay.onclick = function (e) {
		if (e.target === manualOverlay) {
			manualOverlay.classList.add("hidden");
			manualColumn.classList.add("translate-x-full");
		}
	};

	const manualColumn = document.createElement("div");
	manualColumn.className =
		"fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300";
	manualColumn.innerHTML = /* HTML */ `
		<button
			class="absolute right-4 top-4 text-gray-500 hover:text-black"
			onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')"
		>
			${CloseIcon()}
		</button>
		<h2 class="mb-4 text-xl font-bold">📖 이용 안내</h2>
		<div class="mb-6">
			<h3 class="mb-3 text-base font-bold">💰 할인 정책</h3>
			<div class="space-y-3">
				<div class="rounded-lg bg-gray-100 p-3">
					<p class="mb-1 text-sm font-semibold">개별 상품</p>
					<p class="pl-2 text-xs text-gray-700">
						• 키보드 10개↑: 10%<br />
						• 마우스 10개↑: 15%<br />
						• 모니터암 10개↑: 20%<br />
						• 스피커 10개↑: 25%
					</p>
				</div>
				<div class="rounded-lg bg-gray-100 p-3">
					<p class="mb-1 text-sm font-semibold">전체 수량</p>
					<p class="pl-2 text-xs text-gray-700">• 30개 이상: 25%</p>
				</div>
				<div class="rounded-lg bg-gray-100 p-3">
					<p class="mb-1 text-sm font-semibold">특별 할인</p>
					<p class="pl-2 text-xs text-gray-700">
						• 화요일: +10%<br />
						• ⚡번개세일: 20%<br />
						• 💝추천할인: 5%
					</p>
				</div>
			</div>
		</div>
		<div class="mb-6">
			<h3 class="mb-3 text-base font-bold">🎁 포인트 적립</h3>
			<div class="space-y-3">
				<div class="rounded-lg bg-gray-100 p-3">
					<p class="mb-1 text-sm font-semibold">기본</p>
					<p class="pl-2 text-xs text-gray-700">• 구매액의 0.1%</p>
				</div>
				<div class="rounded-lg bg-gray-100 p-3">
					<p class="mb-1 text-sm font-semibold">추가</p>
					<p class="pl-2 text-xs text-gray-700">
						• 화요일: 2배<br />
						• 키보드+마우스: +50p<br />
						• 풀세트: +100p<br />
						• 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
					</p>
				</div>
			</div>
		</div>
		<div class="mt-4 border-t border-gray-200 pt-4">
			<p class="mb-1 text-xs font-bold">💡 TIP</p>
			<p class="text-2xs leading-relaxed text-gray-600">
				• 화요일 대량구매 = MAX 혜택<br />
				• ⚡+💝 중복 가능<br />
				• 상품4 = 품절
			</p>
		</div>
	`;

	manualOverlay.appendChild(manualColumn);

	// gridContainer
	const gridContainer = document.createElement("div");
	gridContainer.className =
		"grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden";
	gridContainer.appendChild(leftColumn);
	gridContainer.appendChild(rightColumn);

	totalAmt = 0;
	itemCnt = 0;
	lastSel = null;

	root.innerHTML = Header();
	root.appendChild(gridContainer);
	root.appendChild(manualToggle);
	root.appendChild(manualOverlay);

	onUpdateSelectOptions();
	handleCalculateCartStuff();

	const lightningDelay = Math.random() * 10000;
	setTimeout(() => {
		setInterval(function () {
			const luckyIdx = Math.floor(Math.random() * products.length);
			const luckyItem = products[luckyIdx];
			if (luckyItem.q > 0 && !luckyItem.onSale) {
				luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
				luckyItem.onSale = true;
				alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
				onUpdateSelectOptions();
				doUpdatePricesInCart();
			}
		}, 30000);
	}, lightningDelay);

	setTimeout(function () {
		setInterval(function () {
			if (lastSel) {
				let suggest = null;
				for (let k = 0; k < products.length; k++) {
					if (products[k].id !== lastSel) {
						if (products[k].q > 0) {
							if (!products[k].suggestSale) {
								suggest = products[k];
								break;
							}
						}
					}
				}
				if (suggest) {
					alert(`💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
					suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
					suggest.suggestSale = true;
					onUpdateSelectOptions();
					doUpdatePricesInCart();
				}
			}
		}, 60000);
	}, Math.random() * 20000);
}

main();

addBtn.addEventListener("click", function () {
	const selItem = sel.value;
	let hasItem = false;

	for (let idx = 0; idx < products.length; idx++) {
		if (products[idx].id === selItem) {
			hasItem = true;
			break;
		}
	}

	if (!selItem || !hasItem) {
		return;
	}

	let itemToAdd = null;

	for (let j = 0; j < products.length; j++) {
		if (products[j].id === selItem) {
			itemToAdd = products[j];
			break;
		}
	}

	if (itemToAdd && itemToAdd.q > 0) {
		const item = document.getElementById(itemToAdd["id"]);
		if (item) {
			const qtyElem = item.querySelector(".quantity-number");
			const newQty = parseInt(qtyElem["textContent"]) + 1;
			if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
				qtyElem.textContent = newQty;
				itemToAdd["q"]--;
			} else {
				alert("재고가 부족합니다.");
			}
		} else {
			const newItem = document.createElement("div");
			newItem.id = itemToAdd.id;
			newItem.className =
				"grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";
			newItem.innerHTML = `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${itemToAdd.onSale && itemToAdd.suggestSale ? "⚡💝" : itemToAdd.onSale ? "⚡" : itemToAdd.suggestSale ? "💝" : ""}${itemToAdd.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500"}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${itemToAdd.onSale || itemToAdd.suggestSale ? `<span class="line-through text-gray-400">₩${itemToAdd.originalVal.toLocaleString()}</span> <span class="${itemToAdd.onSale && itemToAdd.suggestSale ? "text-purple-600" : itemToAdd.onSale ? "text-red-500" : "text-blue-500"}">₩${itemToAdd.val.toLocaleString()}</span>` : `₩${itemToAdd.val.toLocaleString()}`}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
        </div>
      `;

			cartDisp.appendChild(newItem);
			itemToAdd.q--;
		}

		handleCalculateCartStuff();
		lastSel = selItem;
	}
});

cartDisp.addEventListener("click", function (event) {
	const tgt = event.target;

	if (tgt.classList.contains("quantity-change") || tgt.classList.contains("remove-item")) {
		const prodId = tgt.dataset.productId;
		const itemElem = document.getElementById(prodId);
		let prod = null;

		for (let prdIdx = 0; prdIdx < products.length; prdIdx++) {
			if (products[prdIdx].id === prodId) {
				prod = products[prdIdx];
				break;
			}
		}

		if (tgt.classList.contains("quantity-change")) {
			const qtyChange = parseInt(tgt.dataset.change);
			const qtyElem = itemElem.querySelector(".quantity-number");
			const currentQty = parseInt(qtyElem.textContent);
			const newQty = currentQty + qtyChange;

			if (newQty > 0 && newQty <= prod.q + currentQty) {
				qtyElem.textContent = newQty;
				prod.q -= qtyChange;
			} else if (newQty <= 0) {
				prod.q += currentQty;
				itemElem.remove();
			} else {
				alert("재고가 부족합니다.");
			}
		} else if (tgt.classList.contains("remove-item")) {
			const qtyElem = itemElem.querySelector(".quantity-number");
			const remQty = parseInt(qtyElem.textContent);
			prod.q += remQty;
			itemElem.remove();
		}

		handleCalculateCartStuff();
		onUpdateSelectOptions();
	}
});
