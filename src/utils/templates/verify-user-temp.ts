export const verifyUserTemp = (firstName: string, verificationLink: string) => {
    const html = `
          <!DOCTYPE html>
          <html lang="en">
      
          <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
              <title>Admin Invitation</title>
              <style>
                  body {
                      font-family: "Open Sans", sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f4;
                  }
      
                  .container {
                      width: 80%;
                      margin: auto;
                      overflow: hidden;
                  }
      
                  header {
                      background: #390535;
                      color: #ffffff;
                      padding-top: 30px;
                      min-height: 70px;
                      border-bottom: #e8491d 4px solid;
                      font-size: 2em;
                      text-align: center;
                  }
      
                  header a {
                      color: #ffffff;
                      text-decoration: none;
                      text-transform: uppercase;
                      font-size: 16px;
                  }
      
                  main {
                      padding: 20px 0;
                  }
      
                  footer {
                      background: #390535;
                      color: #ffffff;
                      text-align: center;
                      padding: 10px 0;
                  }
              </style>
          </head>
      
          <body>
              <header>
                  <div class="container">
                      <h1>Welcome to Task Master Service</h1>
                  </div>
              </header>
              <main>
                  <div class="container">
                      <h2>Hi ${firstName},</h2>
    <p>Please verify your account by clicking this link ${verificationLink} </p>
                  </div>
              </main>
              <footer>
                  <div class="container">
                      <p>&copy; 2022 FSO</p>
                  </div>
              </footer>
          </body>
      
          </html>
          `;
    return html;
  };
  