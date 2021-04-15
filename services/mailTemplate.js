

const mailTemplate = ({ emailFrom, baseUrl, downloadLink }) => {
  const imagePath = baseUrl
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
    <style>
      body {
        background-color: #edf5fe;
      }
      header img {
        width: 100px;
        object-fit: contain;
      }

      main {
        padding: 20px 32px;
        font-size: 24px;
      }
      main h2 {
        font-size: 0.9em;
      }
      .container {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }

      .container img {
        width: 120px;
        object-fit: contain;
      }

      .container__info p {
        margin: 0;
        margin-bottom: 4px;
        font-size: 0.8em;
      }

      .container__info a {
        font-size: 0.9em;
        display: block;
        width: fit-content;
        margin-top: 12px;
        text-decoration: none;
        color: white;
        background-color: lightblue;
        padding: 12px 24px;
        border-radius: 6px;
      }

      @media (max-width: 767px) {
        main h2 {
          font-size: 0.8em;
        }
        .container img {
          width: 100px;
        }

        .container__info p {
          font-size: 0.7em;
        }

        .container__info a {
          font-size: 0.7em;
        }
      }
      @media (max-width: 567px) {
        main h2 {
          font-size: 0.7em;
          text-align: center;
        }

        .container {
          flex-direction: column;
        }
        .container img {
          width: 80px;
        }

        .container__info {
          margin-top: 12px;
        }
      }
    </style>
  </head>
  <body>
    <header>
        <img src="${imagePath}/image/logo.png" alt="logo">
    </header>
    <main>
        <h2> ${emailFrom} has shared a file with you! </h2>
        <div class="container">
            <img src="${imagePath}/image/documents.png" alt="docs">
            <div class="container__info">
                <p> Thank you for choosing us! </p>
                <p> Your file is ready for download. Please use the link below: </p>
                <a href=${downloadLink}> Download Now </a>
            </div>
        </div>
    </main>
  </body>
</html>

    `;
};

module.exports= mailTemplate
