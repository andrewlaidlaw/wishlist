import React, { useState, useEffect } from "react";
import {
  AILabel,
  AILabelContent,
  AILabelActions,
  Button,
  Column,
  Content,
  Grid,
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  SkipToContent,
  Tag,
  Tile,
  Theme
} from "@carbon/react";
import { unstable_FeatureFlags as FeatureFlags } from '@carbon/react';
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
        <FeatureFlags
          flags={{
            'enable-v12-tile-default-icons': true,
          }}>
          <div className="ai-label-tile-container">

            {wishes.map((item, index) => <Wish key={index} id={index + 1} wish={item.wish} name={item.name} time={item.time} sentiment={item.sentiment} category={item.category} />)}
          </div>
        </FeatureFlags>
      </Column>
    );
  }

  // Component to display an individual wish
  const Wish = (props) => {
    var wishname = "";
    var time = "";
    var aiused = false;
    if (props.name === "") { wishname = "Anonymous" } else { wishname = props.name };
    if (props.time) { time = new Date(props.time).toLocaleString() } else { time = "unknown time" };
    if (props.sentiment) { aiused = true };
    if (props.category) { aiused = true };

    if (aiused) {
      var tags;
      var aitags;
      var sentiment;
      if (props.sentiment === "positive") {sentiment="green"} 
      if (props.sentiment === "negative") {sentiment="red"}
      if (props.sentiment === "neutral") {sentiment="cool-gray"}
      if (props.sentiment) { tags = <Tag type={sentiment}>{props.sentiment}</Tag>; aitags = <p className="secondary">Sentiment</p> }
      if (props.category) { tags = <Tag type="purple">Category: {props.category}</Tag>; aitags = <p className="secondary">Category</p> }
      if (props.category && props.sentiment) {
        tags = <div><Tag type={sentiment}>{props.sentiment}</Tag><Tag type="purple">Category: {props.category}</Tag></div>;
        aitags = <div><p className="secondary">Category</p>
          <p className="secondary">Sentiment</p></div>
      }

      return (
        <Tile key={props.id} className="tile-panel" id={props.id} decorator={
          <AILabel className="ai-label-container">
            <AILabelContent>
              <div>
                <h6 className="secondary">AI Explained</h6>
                <p className="secondary">A large language model has been used to analyze the originally provided text data to provide greater insight.</p>
                <hr /><br />
                <h6 className="secondary">Model type</h6>
                <p className="wish-code">Foundation model</p>
                <h6 className="secondary">Data inferred</h6>
                {aitags}
              </div>
              <AILabelActions>
                <Button>View details</Button>
              </AILabelActions>
            </AILabelContent>
          </AILabel>
        }>
          <h2 className="tile-heading">Wish {props.id}:</h2>
          <p>
            {props.wish}
          </p>
          <p className="tile-footer">
            <br />
            [ {wishname} ] - {time}
          </p>
          {tags}
        </Tile>
      )
    } else {
      return (
        <Tile key={props.id} className="tile-panel" id={props.id} >
          <h2 className="tile-heading">Wish {props.id}:</h2>
          <p>
            {props.wish}
          </p>
          <p className="tile-footer">
            <br />
            [ {wishname} ] - {time}
          </p>
        </Tile>
      )
    }

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
                  Partners the option to be anonymous. Ideas are presented in the order they were submitted.
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