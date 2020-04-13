import React, { Component } from 'react';
import './Search.css';
import axios from 'axios';


class Search extends Component{

    constructor(props){
        super(props);

        this.state = {
            query: '',
            results: {},
            loading: false,
            message: ''
        }

        this.cancel = '';
    }

    fetchSearchResults = (query) => {
        const searchUrl = `https://itunes.apple.com/search?term=${query}`;

        if(this.cancel){
            this.cancel.cancel();
        }

        this.cancel = axios.CancelToken.source();

        axios.get( searchUrl, {
            cancelToken: this.cancel.token
        } ).then(res => {
            const resultNotFoundMsg = !res.data.results.length ?
            'There are no results' : '';

            this.setState({
                results: res.data.results,
                message: resultNotFoundMsg,
                loading: false
            })
        }).catch( error => {
            if(axios.isCancel(error) || error){
                this.setState({
                    loading: false,
                    message: 'failed to fetch'
                })
            }
        })
    };

    handleOnInputChange = (event) => {
        const query = event.target.value;
        this.setState( {
            query: query,
            loading: true,
            message: ''
        }, () => {
            this.fetchSearchResults(query);
        } );
    };

    renderSearchResults = () => {
        const {results} = this.state;
        
        if(Object.keys(results).length && results.length){
            return (
                <div className="results-container">
                    { results.map(result => {
                        return(
                            <a key={result.trackId} href={result.previewUrl} className="result-item">
                                <h6 className="image-username">{result.trackName}</h6>
                                <div className="image-wrapper">
                                    <img className="image" src={result.artworkUrl100} alt={result.trackName} />
                                </div>
                            </a>
                        )
                    })}
                </div>
            )
        }
    };

    render() {

        const {query,  message} = this.state;
        return(
            <div className="container">
                <h2 className="heading">Itunes Search</h2>
                <label className="search-label" htmlFor="search-input">
                    <input
                        name="query"
                        type="text"
                        value={query}
                        id="search-input"
                        placeholder="search..."
                        onChange={this.handleOnInputChange}
                    />
                    
                </label>
                
                {/*message*/}
                {message && <p className="message"> {message} </p>}

               

                {/* Results */}
                {this.renderSearchResults()}
            </div>
        )
    }       
}

export default Search;



 

