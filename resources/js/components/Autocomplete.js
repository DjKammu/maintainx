import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { showSznNotification} from '../Helpers'

class Autocomplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });

    {(( !newValue && this.props.fn && !this.props.text ) || ( newValue && this.props.fn && this.props.text) )  && 
         this.props.fn(newValue)
    }

  };

  shouldRenderSuggestions = () => {
    return true;
  };

  onSuggestionsFetchRequested = async ({ value }) => {
      if(!this.props.url){
       const suggestions = this.getSuggestions(value);
       this.setState({
              suggestions: suggestions
            });
       return;
      }
      await axios.get(this.props.url+value)
      .then(response => {
            this.setState({
              suggestions: response.data.message.data
            });
      })
      .catch(error => {
             this.onSuggestionsClearRequested();
             showSznNotification({
                type : 'error',
                message : (error.response) ? error.response.data.message : 'Something Went Wrong!'
            });
      });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion}) => {
     this.props.fn(suggestion);
  };

  getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? this.props.options : this.props.options.filter(option =>
      option.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  getSuggestionValue = suggestion => suggestion.name;

  renderSuggestion = suggestion => (
    <span>
      {suggestion.name}
    </span>
  );

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: (this.props.placeholder) ? this.props.placeholder : 'Select',
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
      />
    );
  }
}

export default Autocomplete;
