import React from 'react';
import Axios from "axios";
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


class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listings: [],
    }
  }

  componentWillMount() {
    Axios
      .get(`http://localhost:2308/api/all-listings`)
      .then(response => {
        console.log(response);

        this.setState({
          userName: response.data.profile.user_name,
          userId: response.data.profile.user_id,
          userProfile: {
            // userName: response.data.profile.user_name,
            profileDescription: response.data.profile.profile_description,
            createdAt: response.data.profile.created_at,
            updatedAt: response.data.profile.updated_at
          },
          profileListings: response.data.listings,
        });
      })
      .catch(error => console.log(error));
  }

  renderListings = () => {
    if (this.state.listings.length > 0) {
      return this.state.listings.map((l) =>
        <ListingItem key={l.property_id}
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
export default HomePage;
