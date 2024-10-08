<template>
  <div class="manager-product">
    <div class="nav">
      <router-link to="/admin">Dashboard</router-link>
      <router-link to="/admin/manager-category">Manager Category</router-link>
      <router-link to="/admin/manager-product">Manager Product</router-link>
    </div>
    <div class="header">
      <div class="nav2">
        <h3>Manager Product</h3>
        <button class="add-product-btn" @click="showAddProduct = true">
          Add New Product
        </button>
      </div>
      <input
        v-model="searchQuery"
        @input="filterProducts"
        placeholder="Search product by name..."
        class="search-input"
      />
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Option</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in filteredProducts" :key="index">
            <td>{{ index + 1 }}</td>
            <td><img :src="product.image" alt="Product Image" width="50" /></td>
            <td>{{ product.name }}</td>
            <td>{{ formatVND(product.price) }}</td>
            <td>{{ product.quantity }}</td>
            <td>
              <button class="edit-btn" @click="editProduct(product, index)">
                Edit
              </button>
              <button class="delete-btn" @click="showDeleteConfirm(index)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- thêm mới sản phẩm -->
    <div v-if="showAddProduct" class="modal">
      <div class="modal-content">
        <h2>{{ editIndex !== null ? "Edit Product" : "Add New Product" }}</h2>
        <label>Name:</label>
        <input v-model="newProduct.name" placeholder="Product Name" required />
        <div v-if="errorMessages.name" class="error">
          {{ errorMessages.name }}
        </div>

        <label>Image URL:</label>
        <input v-model="newProduct.image" placeholder="Image URL" required />
        <div v-if="errorMessages.image" class="error">
          {{ errorMessages.image }}
        </div>

        <label>Price:</label>
        <input
          v-model="newProduct.price"
          type="number"
          placeholder="Price"
          min="10000"
          required
        />
        <div v-if="errorMessages.price" class="error">
          {{ errorMessages.price }}
        </div>

        <label>Quantity:</label>
        <input
          v-model="newProduct.quantity"
          type="number"
          placeholder="Quantity"
          min="1"
          max="100"
          required
        />
        <div v-if="errorMessages.quantity" class="error">
          {{ errorMessages.quantity }}
        </div>

        <div class="form-actions">
          <button class="close-btn" @click="showAddProduct = false">
            Close
          </button>
          <button class="add-btn" @click="saveProduct">
            {{ editIndex !== null ? "Save" : "Add" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h2>Xác nhận</h2>
        <p>Bạn có chắc chắn muốn xoá sản phẩm này?</p>
        <div class="form-actions">
          <button class="close-btn" @click="showDeleteModal = false">
            Cancel
          </button>
          <button class="delete-confirm-btn" @click="confirmDeleteProduct">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAddProduct: false,
      newProduct: { name: "", image: "", price: "", quantity: "" },
      products: JSON.parse(localStorage.getItem("products")) || [],
      errorMessages: {},
      editIndex: null,
      searchQuery: "",
      filteredProducts: [],
      showDeleteModal: false,
      deleteIndex: null,
    };
  },
  mounted() {
    this.filteredProducts = this.products;
  },
  methods: {
    formatVND(money) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(money);
    },
    validateProduct() {
      setTimeout(() => {
        this.errorMessages = {};
      }, 3000);

      let isValid = true;

      if (!this.newProduct.name) {
        this.errorMessages.name = "Tên sản phẩm không thể bỏ trống";
        isValid = false;
      } else if (
        this.products.find(
          (product, index) =>
            product.name === this.newProduct.name && index !== this.editIndex
        )
      ) {
        this.errorMessages.name = "Tên sản phẩm đã tồn tại";
        isValid = false;
      }

      if (!this.newProduct.image) {
        this.errorMessages.image = "Ảnh sản phẩm không thể để trống";
        isValid = false;
      }

      if (!this.newProduct.price) {
        this.errorMessages.price = "Giá tiền sản phẩm không thể để trống";
        isValid = false;
      } else if (this.newProduct.price < 10000) {
        this.errorMessages.price = "Giá thấp nhất là 10,000 đ";
        isValid = false;
      }
      if (!this.newProduct.quantity) {
        this.errorMessages.quantity = "Số lượng sản phẩm không thể để trống";
        isValid = false;
      } else if (
        this.newProduct.quantity < 1 ||
        this.newProduct.quantity > 100
      ) {
        this.errorMessages.quantity = "Số lượng chỉ từ 1 đến 100!";
        isValid = false;
      }
      return isValid;
    },
    saveProduct() {
      if (!this.validateProduct()) return;
      if (this.editIndex !== null) {
        this.products[this.editIndex] = { ...this.newProduct };
        this.editIndex = null;
      } else {
        this.products.push({ ...this.newProduct });
      }
      localStorage.setItem("products", JSON.stringify(this.products));
      this.newProduct = { name: "", image: "", price: "", quantity: "" };
      this.showAddProduct = false;
      this.errorMessages = {};
      this.filterProducts();
    },
    editProduct(product, index) {
      this.newProduct = { ...product };
      this.editIndex = index;
      this.showAddProduct = true;
    },
    showDeleteConfirm(index) {
      this.deleteIndex = index;
      this.showDeleteModal = true;
    },
    confirmDeleteProduct() {
      if (this.deleteIndex !== null) {
        this.products.splice(this.deleteIndex, 1);
        localStorage.setItem("products", JSON.stringify(this.products));
        this.filterProducts();
        this.deleteIndex = null;
        this.showDeleteModal = false;
      }
    },
    filterProducts() {
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
};
</script>
<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}
.header {
  border: 1px solid black;
  padding: 20px;
}
.nav {
  background-color: black;
  padding: 16px;
}
.nav2 {
  display: flex;
  justify-content: space-between;
}
.nav a {
  color: white;
  margin: 0 15px;
  text-decoration: none;
}
.nav a.router-link-exact-active {
  font-weight: bold;
  color: #ffd700;
}
.manager-product {
  margin: 20px;
}
.search-input {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
table,
th,
td {
  border: 1px solid black;
}
th,
td {
  padding: 10px;
  text-align: left;
}
button {
  padding: 5px 10px;
  border-radius: 5px;
  margin: 3px;
  border: none;
  cursor: pointer;
}
.edit-btn {
  background-color: #4caf50;
  color: white;
}
.delete-btn {
  background-color: #f44336;
  color: white;
}

.add-product-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 16px;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.delete-confirm-btn {
  background-color: #f44336;
  color: white;
  font-size: 21px;
  width: 80px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-content h2 {
  margin-bottom: 15px;
}

.modal-content label {
  display: block;
  margin-bottom: 10px;
}

.modal-content input {
  width: 95%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.close-btn {
  background-color: grey;
  color: white;
  font-size: 21px;
  margin-left: 250px;
  width: 80px;
}

.add-btn {
  background-color: #007bff;
  color: white;
  font-size: 21px;
  width: 80px;
}

.error {
  color: red;
  font-size: 0.9em;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
