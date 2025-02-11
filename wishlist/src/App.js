import React from "react";
import {
  Button,
  Column,
  Content,
  Form,
  Grid,
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  TextInput,
  TextArea,
  SkipToContent,
} from "@carbon/react";
import { Theme } from "@carbon/react";
import "./app.scss";
import { useState } from 'react';

function App() {

  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(true);

  // Get URL from environment variable in .env file
  // Must be the full API location (including path)
  // const url = process.env.REACT_APP_BACKEND_URL;
  const url = "http://localhost:8080/insert";

  // handle submission of an idea
  const handleSubmit = (event) => {
    event.preventDefault();
    if (name === "") {
      setName("Anonymous");
    }
    addToMongo(name, question);
    setQuestion("");
    setSubmitted(false);
  }

  //handle the reset of the page
  const handlereset = (event) => {
    event.preventDefault();
    setSubmitted(true);
  }

  // define the function to add an entry to the Mongo Database
  const addToMongo = (name, question) => {
    var data = { name: name, question: question, time: Date.now() };
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
          <SkipToContent />
          <HeaderName
            prefix="IBM"
          >
            Power
          </HeaderName>
          <HeaderNavigation>
            <HeaderMenuItem href="https://www.ibm.com/power/">
              Power Landing Page
            </HeaderMenuItem>
            {/* <HeaderMenuItem href="made.html">
              How we made this
            </HeaderMenuItem> */}
            <HeaderMenuItem href="https://github.com/andrewlaidlaw/wishlist">
              The GitHub repository
            </HeaderMenuItem>
            <HeaderMenuItem href="https://try.openshift.com">
              Red Hat OpenShift
            </HeaderMenuItem>
            <HeaderMenuItem href="https://www.ibm.com/partnerplus">
              IBM Partner Plus
            </HeaderMenuItem>
          </HeaderNavigation>
        </Header>
      </Theme>

      {!submitted ||
        <div>
          <Theme theme="white">
            <Content>
              <Grid>
                <Column md={6} lg={{ span: 8, offset: 4 }} sm={4} >
                  <h2 className="wish-heading">Ask the IBM Leadership team</h2>
                  <p className="wish-p">
                    We all know that the Partner Ecosystem is critically important to IBM, particularly in 2025 as we follow our ambitious growth targets.
                    What is important to you as a Power and Storage Business Partner? What burning questions do you have for the Power, Storage, and Ecosystem
                    leadership team to help you achieve your own ambitions?
                    </p>
                    <p className="wish-p">
                      Submit your questions in the form below to have them raised with the IBM Leaders at the IBM Power and Storage Partner day on 4th March 2025.
                      You can submit questions anonymously, or include your name if you would also like to follow up with the team personally. Ask as many
                      questions as you would like.
                  </p>
                </Column>
                <Column md={6} lg={{ span: 8, offset: 4 }} sm={4}>
                  <Form onSubmit={handleSubmit}>
                    <TextInput id="name" type="text" labelText="Your name [optional]" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextArea className="wish-input" labelText="Your question for the team" helperText="Submit your question here to be asked of the IBM Leadership team" rows={4} id="question" onChange={(w) => setQuestion(w.target.value)} />
                    <Button className="wish-input" kind="primary" type="submit" id="submit-button">Submit</Button>
                  </Form>
                </Column>
              </Grid>
            </Content>
          </Theme>
        </div>
      }
      {submitted ||
        <Theme theme="white">

          <Content>
            <Grid>
              <Column md={6} lg={{ span: 8, offset: 4 }} sm={4}>
                <h2 className="wish-heading">Thank you</h2>
                <p className="wish-p">
                  Thank you for your submisison. Feel free to submit another question to be asked of the Leadership team. 
                  We look forward to seeing you in IBM York Road on 4th March.

                </p>
                <Button className="wish-input" kind="primary" type="button" id="reset-button" onClick={handlereset}>Add another question</Button>
              </Column>
            </Grid>
          </Content>

        </Theme>
      }
    </Content >

    // </BrowserRouter>
  );
}

export default App;