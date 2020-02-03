/* 
	Khai báo các constants
*/
const STORAGE_KEY = 'storageKey'; // key của data sẽ lưu trong localStorage
const KEYWORDS_KEY = 'searchKeywords'; // key của data lịch sử tìm kiếm
const ENTER_KEY_CODE = 13; // code của phím enter

// Khởi tạo đối tượng từ constructor function `Storage`
const Cache = new Storage(STORAGE_KEY);

// Lấy ra những nodes/elements trong DOM
const searchInputNode = document.querySelector('.search-bar__input'); // ô search input
const searchBtnNode = document.querySelector('.search-bar__search-btn'); // search button
const searchHistoryNode = document.querySelector('.search-bar__history'); // box lịch sử

// Khi click vào search button
searchBtnNode.onclick = function() {
	handleSearch(searchInputNode.value);
};

// Khi click vào box lịch sử
searchHistoryNode.onclick = function(e) {
	handleRemoveHistoryItem(e);
  handleSearchByHistory(e);
};

// Khi nhấn phím `enter` trong ô input
searchInputNode.onkeydown = function(e) {
	if (e.keyCode === ENTER_KEY_CODE) { // 13 là code của phím enter
  	handleSearch(searchInputNode.value);
  }
}

/* 
  Khi click vào ô input, ta hiểu là đang `focus` tại ô input. Khi đó
  box lịch sử tìm kiếm sẽ hiển thị (nếu có lịch sử)
  
  Nếu ta `click` vào ô kết quả khi đó, box lịch sử sẽ bị ẩn vì hành động
  mặc định khi click chuột ra khỏi input sẽ làm mất `focus` của input.
  
  Mất `focus` của input box lịch sử sẽ ẩn đi và ta ko thể click vào lịch sử
  tìm kiếm
  
  Vì vậy ta cần bỏ qua hành vi mặc định này để có thể click vào box
  lịch sử
*/
searchHistoryNode.onmousedown = function(e) {
	e.preventDefault(); // bỏ qua hành vi mặc định
}

// Render ra lịch sử tìm kiếm lần đầu khi trang web được load
renderSearchHistory();

// Hàm thực hiện tìm kiếm
function handleSearch(keyword) {
	// Chỉ xử lý khi nhập từ khóa tìm kiếm
  if (keyword) {
  	// Lấy lịch sử tìm kiếm ra và kiểm tra nếu chưa có
    // từ khóa đang tìm trong lịch sử
    // thì lưu từ khóa này vào lịch sử
  	const cachedKeywords = Cache.get(KEYWORDS_KEY, []);
    if (!cachedKeywords.includes(keyword)) {
    	// Dấu ... ở đây là khái niệm `spread`
      Cache.set(KEYWORDS_KEY, [...cachedKeywords, keyword]);
      
      // Render lại lịch sử tìm kiếm
      renderSearchHistory();
    }
    
    // Clear text tại ô tìm kiếm (nếu cần)
    searchInputNode.value = '';
    
    // Logic tìm kiếm bạn sẽ viết ở đây
    alert(`Từ khóa: ${keyword}. Call API để tìm kiếm...`);
  }
}

/* 
	Hàm xóa lịch sử tìm kiếm
*/
function handleRemoveHistoryItem(event) {
	// Ở đây mình sử dụng `Event delegation pattern`, các bạn search
  // từ khóa trên để tìm hiểu xem tại sao phải sử dụng nó
  if (event.target.classList.contains('search-bar__history-remove')) {
  	// Lấy giá trị `index` của lịch sử qua attribute
    // được set hàm `renderSearchHistory`
  	const historyIndex = event.target.getAttribute('data-index');
    
    // Lấy lịch sử ra và xóa bỏ từ khóa theo `historyIndex`
    const cachedKeywords = Cache.get(KEYWORDS_KEY, []);
    cachedKeywords.splice(historyIndex, 1);
    
    // Lưu lại lịch sử đã được xóa item theo `historyIndex`
    Cache.set(KEYWORDS_KEY, cachedKeywords);
    
    // Render lại box lịch sử
  	renderSearchHistory();
  }
}

// Hàm xử lý tìm kiếm khi click vào từ khóa trong box lịch sử
function handleSearchByHistory(event) {
	// Sử dụng Event delegation pattern
	if (event.target.classList.contains('search-bar__history-item')) {
  	const historyValue = event.target.getAttribute('data-value');
    
    // Gọi hàm tìm kiếm
    handleSearch(historyValue);
  }
}

// Hàm render ra list lịch sử tìm kiếm
function renderSearchHistory() {
	let html = '';
  // Lấy lịch sử và lặp qua, từ đó tạo ra HTML string
  const histories = Cache.get(KEYWORDS_KEY, []);
  let i = histories.length;
  while(i > 0) {
    i--;
    // dấu `` là khái niệm `template string`
    html += `
    	<li class="search-bar__history-item" data-value="${histories[i]}">
      	${histories[i]}
        <span class="search-bar__history-remove" data-index="${i}">Remove</span>
       </li>
    `;
  }
  
  // Set HTML string vừa được tạo ra vào box lịch sử tìm kiếm
  // trong VD cơ bản này tồn tại lỗi bảo mật XSS
  // vì ví dụ này cơ bản, nên ta ko xử lý lỗi này. Các bạn hãy tìm hiểu thêm
  searchHistoryNode.innerHTML = html;
}

/* 
	Hàm tạo đói tượng lưu trữ, ở đây ta đặt tên là `Storage`
  Để hiểu về cách viết của hàm này, các bạn tìm hiểu:
  	1. Object constructor in Javascript
  	2. localStorage in Javascript
*/
function Storage(storageKey) {
	// Lấy data lưu tại `localStorage` ra, data lưu tại đây là JSON
  // nên ta cần parse JSON string này để lấy được object và lưu vào biến `store`
	const store = JSON.parse(localStorage.getItem(storageKey)) || {};
  
  // Hàm lưu data của biến `store` vào localStorage, stringify để chuyển
  // từ object thành JSON string
  const save = function() {
  	localStorage.setItem(storageKey, JSON.stringify(store));
    return store;
  }
  
  // Phương phức / hàm lấy giá trị được lưu trong `localStorage` theo `key`
  // defaultValue sẽ được trả về nếu `key` chưa được lưu data
  this.get = function(key, defaultValue = null) {
    if (typeof store[key] !== 'undefined' && store[key]) {
    	return store[key];
    }
    return defaultValue;
  }
  
  // Phương thức / hàm set giá trị (lưu giá trị) vào `localStorage`
  // chúng ta sẽ lưu theo `key`. Cách sử dụng: Cache.set('key_của_bạn', 'giá_trị_cần_lưu');
  this.set = function(key, value) {
  	store[key] = value;
    save();
    return value;
  }
  
  // Bạn có thể add thêm các phương thức khác. VD. has, remove, flush, ...
}




