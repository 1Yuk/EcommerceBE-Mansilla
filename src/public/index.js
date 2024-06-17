const socketClient = io();

socketClient.on("connect", () => {
    console.log("User connected");
});

const createProductForm = document.getElementById("createProduct");
createProductForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const code = document.getElementById("code").value;
    const id = document.getElementById("id").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;

    const product = {
        title,
        description,
        thumbnail,
        code,
        price: parseFloat(price),
        stock: parseFloat(stock),
        id: parseFloat(id)
    };

    socketClient.emit("createProduct", product);
    createProductForm.reset();
});

socketClient.on("productCreated", (data) => {
    location.reload();
});

socketClient.on("productError", (error) => {
    console.error("Error al crear producto:", error.message);
});