import React from 'react';
import axios from 'axios';

import RPCard from './RPCard.jsx';
import Arrow from './Arrow.jsx';

class RelatedProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentProduct: {},

      allRelated: [],
      visibleRelated: [],
      firstCard: 0,
      lastCard: 4,
      lastIndex: 0
    };

    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
    this.fetchData = this.fetchData.bind(this);

    this._isMounted = false;
  }

  fetchData(itemId) {
    // get those items
    axios.get(`/products/${itemId}/related`)
      .then(res => {

        this.setState({
          allRelated: res.data,
          lastIndex: res.data.length,
          currentProduct: this.props.currentItem,
          firstCard: 0,
          lastCard: 4
        }, () => {
          // console.log(this.state);
          this.setState({
            visibleRelated: this.state.allRelated.slice(this.state.firstCard, this.state.lastCard)
          })
        })
      })
      .catch(err => {
        console.log('/RELATED GET ERROR: ', err)
      })
  }

  componentDidUpdate(prevProps) {

    if (this.props.currentItem !== prevProps.currentItem) {
      this._isMounted = true;
      this._isMounted && this.fetchData();
    }
  }

  componentDidMount() {

    this._isMounted = true;
    var itemId = this.props.currentItem['id'];
    this._isMounted && itemId && this.fetchData(itemId);

  }
  // Arrow Functionality
  previousSlide () {
    // console.log('clicked previous slide');
    const lastIndex = this.state.allRelated.length - 1;
    if (this.state.firstCard > 0) {
      this.setState({
        firstCard: this.state.firstCard -1,
        lastCard: this.state.lastCard -1
      }, () => {
        this.setState({
          visibleRelated: this.state.allRelated.slice(this.state.firstCard, this.state.lastCard)
        });
      });
    }
  }
  // Arrow Functionality
  nextSlide () {
    // console.log('clicked next slide');
    const lastIndex = this.state.allRelated.length - 1;
    if (this.state.lastCard <= lastIndex) {
      this.setState({
        firstCard: this.state.firstCard +1,
        lastCard: this.state.lastCard +1,
      }, () => {
        this.setState({
          visibleRelated: this.state.allRelated.slice(this.state.firstCard, this.state.lastCard),
        });
      });
    }
  }

  renderList () {
    return (
      <div className='slide-container'>

        <div className="rr-carousel-arrow">
          <Arrow
            direction="left"
            clickFunction={ this.previousSlide }
          />
        </div>

        {this.state.allRelated.length > 0 && (
          <div className='items-container'>
            {this.state.allRelated.map((relatedItem, index) => {
              console.log('item: ', relatedItem);
              return (
              <div className='single-item-container'>
                <RPCard
                  itemId={relatedItem}
                  key={index}
                  click={this.props.click}
                  currentProduct={this.state.currentProduct}
                />
              </div>
              )
            })}
          </div>
        )}

        <div className="rr-carousel-arrow">
          <Arrow
            direction="right"
            clickFunction={ this.nextSlide }
          />
        </div>

      </div>
    )
  }

  render() {
    return (
      <div>
        <h2>Related Products</h2>
        <div>

          { this.renderList() }

        </div>
      </div>
    )
  }
}

export default RelatedProducts;