const generateForm=document.querySelector(".generate-form");
const imageGallery=document.querySelector(".image-gallery");

const OPENAI_API_KEY ='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'

const updateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject, index) =>{
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector("download-btn");

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async (userprompt, userImgQuantity) => {
    try{
        const response = await fetch("https://api-inference.huggingface.co/models/Melonie/text_to_image_finetuned",{
            method: "POST",         
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userprompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        console.log("API Response Status: ", response.status);
        if (!response.ok) throw new Error(`Failed to generate images! try again.. ${response.status}`);

        const { data } = await response.json();
        updateImageCard([...data]);

    } catch (error) {
        alert(error.message);
    }
}


const handleFormSubmission = (e) => {
    e.preventDefault();
    
    const userprompt=e.srcElement[0].value;
    const userImgQuantity=e.srcElement[1].value;

    const imgCardMarkup=Array.from({length: userImgQuantity}, () =>
        `<div class="img-card loading">
            <img src="loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="download.svg" alt="download icon">
            </a>
        </div>`
    ).join("");
    
    imageGallery.innerHTML = imgCardMarkup;

    generateAiImages(userprompt, userImgQuantity);

}
generateForm.addEventListener("submit", handleFormSubmission)



document.querySelector('.signout-btn').onclick = function (e) {
    e.preventDefault();
    alert("Thank you for visiting...");
    window.location.href = 'signup.html';
};
