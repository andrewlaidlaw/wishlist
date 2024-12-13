import React from "react";
import {
  Button,
  Column,
  Content,
  Form,
  Grid,
  Header,
  HeaderName,
  TextInput,
  TextArea,
} from "@carbon/react";
import { Theme } from "@carbon/react";
import "./app.scss";
import { useState } from 'react';

function App() {

  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [submitted, setSubmitted] = useState(true);

  // Get URL from environment variable in .env file
  // Must be the full API location (including path)
  const url = process.env.REACT_APP_BACKEND_URL;
  // const url = "http://localhost:8080/insert";

  // handle submission of an idea
  const handleSubmit = (event) => {
    event.preventDefault();
    if (name === "") {
      setName("Anonymous");
    }
    addToMongo(name, wish);
    setWish("");
    setSubmitted(false);
  }

  //handle the reset of the page
  const handlereset = (event) => {
    event.preventDefault();
    setSubmitted(true);
  }

  // define the function to add an entry to the Mongo Database
  const addToMongo = (name, wish) => {
    var data = { name: name, wish: wish, time: Date.now() };
    console.log(data);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    // <BrowserRouter>
    <Content>
      <Theme theme="g100">
        <Header aria-label="IBM Power">
          <HeaderName
            href="https://www.ibm.com/power/"
            prefix="IBM"
          >
            Power
          </HeaderName>
        </Header>
      </Theme>
      <Theme theme="white">
        {!submitted ||
          <Content>
            <Grid>
              <Column md={6} lg={{ span: 8, offset: 4 }} sm={4}>
                <h2 className="wish-heading">2025 Wishlist</h2>
                <p className="wish-p">
                  What do you want to see from IBM Power in 2025? Contribute your wish today to help
                  influence how the IBM Power team in the UK and Ireland work with our Ecosystem of
                  Partners over the next 12 months.
                </p>
                <Form onSubmit={handleSubmit}>
                  <TextInput id="name" type="text" labelText="Your name [optional]" value={name} onChange={(e) => setName(e.target.value)} />
                  <TextArea className="wish-input" labelText="Your wish for 2025" helperText="Add your idea here for what you would like to see from IBM Power in 2025" rows={4} id="wish" onChange={(w) => setWish(w.target.value)} />
                  <Button className="wish-input" kind="primary" type="submit" id="submit-button">Submit</Button>
                </Form>
              </Column>
            </Grid>
          </Content>
        }
        {submitted ||
          <Content>
            <Grid>
              <Column md={6} lg={{ span: 8, offset: 4 }} sm={4}>
                <h2 className="wish-heading">2025 Wishlist</h2>
                <p className="wish-p">
                  Thank you for your submisison. Feel free to add another wish to the list - the more great
                  ideas that you submit the better next year can be for all of us.

                </p>
                  <Button className="wish-input" kind="primary" type="button" id="reset-button" onClick={handlereset}>Add another wish</Button>
              </Column>
            </Grid>
          </Content>
        }
      </Theme>
    </Content>
    // </BrowserRouter>
  );
}

export default App;