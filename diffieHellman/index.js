function displayTexts(text1, text2) {
    const a = document.getElementById("0");
    const b = document.getElementById("1");

    a.classList.add("active");
    b.classList.remove("active");

    a.children[0].textContent = text1;
    b.children[0].textContent = text2;

    return new Promise(resolve => {
        a.children[1].onclick = () => {
            a.classList.remove("active");
            b.classList.add("active");

            b.children[1].onclick = resolve;
        }
    });
}

async function intro() {
    await displayTexts("Hello, World! Have you ever wanted to use two random numbers to get the same number in the end?", "Well the Diffie-Hellman Key Exchange is the way to go!");
    await displayTexts("HOW IT WORKS", "HERE'S HOW THE EXAMPLE WORKS");
}

intro();