import React from 'react';
import Axios from "axios/index";
import ListingItem from "../ListingItem";
import styled from "styled-components";

const StyledWrapper = styled.div`
  h3 {
    font-size: 25px;
    font-weight: 600;
    color: primary;
  }
  .warning-home {
    margin: 0 auto;
    width: 400px;
    padding: 200px 0;
  }
`;


class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listings: [],
    }
  }

  componentWillMount() {
    let API_URL;
    if(this.props.pageType == null) {
      API_URL = `http://localhost:2308/api/pages/all-listings`;
    } else if(this.props.pageType == "apartments") {
      API_URL = `http://localhost:2308/api/pages/apartments`;
    } else {
      API_URL = `http://localhost:2308/api/pages/homes`;
    }
    Axios
      .get(API_URL)
      .then(response => {
        console.log(response);

        this.setState({
          listings: response.data.listings,
        });
      })
      .catch(error => console.log(error));
  }

  renderListings = () => {
    if (this.state.listings && this.state.listings.length > 0) {
      return this.state.listings.map((l) =>
        <ListingItem key={l.property_id}
                     listingId={l.property_id}
                     listingDescription={l.listing_description}
                     price={l.listing_price}
                     currency={l.listing_currency}
                     createdAt={l.created_at}
                     updatedAt={l.updated_at}
        />
      );
    } else {
      return <div className={"warning-home"}><h3>Now we dont have any listings</h3></div>
    }
  };

  render() {
    return (
      <StyledWrapper>
        {this.renderListings()}
      </StyledWrapper>
    )
  }
}
export default MainPage;
