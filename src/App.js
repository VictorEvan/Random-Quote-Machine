import React, { Component } from 'react';
import './css/App.css';

const TwitterButton = props =>
  <a className="resp-sharing-button__link" href={props.hrefValue} target="_blank" aria-label="">
    <div className="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small"><div aria-hidden="true" className="resp-sharing-button__icon resp-sharing-button__icon--solid">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>
      </div>
    </div>
  </a>

class App extends Component {
  
  queryStringify = (str) => {
    let newStr = str;
    newStr = newStr.replace(/( )/g,"%20");
    newStr = newStr.replace(/(;)/g,"%3B");
    newStr = newStr.replace(/(,)/g,"%2C");
    return newStr;
  }

  defaultQuote= "When we treat man as he is, we make him worse than he is; when we treat him as if he already were what he potentially could be, we make him what he should be.";
  defaultAuthor= "Johann Wolfgang von Goethe";
  defaultTwitterQuery = `https://twitter.com/intent/tweet/?text=%22${this.queryStringify(this.defaultQuote)}%22%20-%20${this.queryStringify(this.defaultAuthor)}`;
  currentQuoteIndex = null;

  state = {
    quote: this.defaultQuote,
    author: this.defaultAuthor,
    twitterQuery: this.defaultTwitterQuery,
    cycle: 1,
  }
  
  authorColor= "";
  background= "base";

  componentDidMount = () => {
    this.getQuotes();
  }

  getQuotes = () => {
    return fetch("https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json",{
      method: "get",
      headers: {
        "Accept": "application/json",
      }
    })
    .then( response => response.json() )
    .then( response => this.quotes = response.quotes )
    .catch( error => console.error('Error:', error) );
  }

  setNextQuote = () => {
    if (this.currentQuoteIndex === (this.quotes.length - 1)) {
      this.currentQuoteIndex = 0;
    } else {
      this.currentQuoteIndex++;
    }
    this.updateContent(this.quotes[this.currentQuoteIndex]);
  }

  updateContent = data => {
    this.authorColor = `author-color-${this.state.cycle}`;
    this.background = `base background-image-${this.state.cycle}`;
    this.setState({
      quote: data.quote,
      author: data.author,
      cycle: this.state.cycle === 5 ? 1 : this.state.cycle + 1,
      twitterQuery: `https://twitter.com/intent/tweet/?text=%22${this.queryStringify(data.quote)}%22%20-%20${this.queryStringify(data.author)}`
    });
  }

  render() {
    return (
      <div className={this.background}>
        <main className="container">
          <div className="quote">
            <p>{this.state.quote}</p>
          </div>
          <div className={`author ${this.authorColor}`}>
            <span>{this.state.author}</span>
          </div>
          <div className="button-wrap">
              <TwitterButton hrefValue={this.state.twitterQuery} />
              <button onClick={this.setNextQuote} className="new-quote">new quote</button>
          </div>
        </main>
      </div>
    );
  }
}

export default App;