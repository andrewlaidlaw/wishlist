import React, { useState, useEffect } from "react";
import {
  Column,
  Content,
  Grid,
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  SkipToContent,
  Tile,
} from "@carbon/react";
import { Theme } from "@carbon/react";
import "./app.scss";

function App() {

  // Create a state for the full set of wishes
  const [wishes, setWishes] = useState([]);

  // use hook to ensure page components render only once
  useEffect(() => {

    // Get URL from environment variable in .env file
    // Must be the full API location (including path)
    const url = process.env.REACT_APP_READER_URL;
    // const url = "http://localhost:8080/findall";

    // define the function to read all entries from the Mongo Database
    const readFromMongo = () => {
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          // Update the state with retrieved data
          setWishes(data);
        })
        .catch((err) => {
          console.log("Error:");
          console.log(err);
        });
    };

    // Run the function
    readFromMongo();

  }, []);

  // Component to list all wishes retrieved
  const WishList = () => {
    return (
      <Column>
        {wishes.map((item, index) => <Wish key={index} id={index + 1} wish={item.wish} name={item.name} time={item.time} />)}
      </Column>
    );
  }

  // Component to display an individual wish
  const Wish = (props) => {
    var wishname = "";
    var time = "";
    if (props.name === "") { wishname = "Anonymous" } else { wishname = props.name };
    if (props.time) { time = new Date(props.time).toLocaleString() } else { time = "unknown time" };

    return (
      <Tile key={props.id} className="tile-panel">
        <h2 className="tile-heading">Wish {props.id}:</h2>
        <p>
          {props.wish}
        </p>
        <p className="tile-footer">
          [ {wishname} ] - {time}
        </p>
      </Tile>
    )
  }

  // create the contents of the page
  return (

    <Content>

      <Theme theme="g100">
        <Header aria-label="IBM Power">
          <SkipToContent />
          <HeaderName
            prefix="IBM"
          >
            Power
          </HeaderName>
          <HeaderNavigation aria-label="Links menu">
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
          </HeaderNavigation>
        </Header>
      </Theme>

      <div>
        <Theme theme="white">
          <Content>
            <Grid>
              <Column md={6} lg={{ span: 8, offset: 4 }} sm={4} >
                <h2 className="wish-heading">IBM Power 2025 Wishlist</h2>
                <p className="wish-p">
                  Here are the suggestions from our Business Partner community that share what they would
                  like to see from the IBM Power brand in 2025. All ideas were welcomed, and we gave our
                  Partners the option to be ananymous.
                </p>
              </Column>
              <Column md={6} lg={{ span: 8, offset: 4 }} sm={4}>
                <WishList />
              </Column>
            </Grid>
          </Content>
        </Theme>
      </div>

    </Content >

  );
}

export default App;