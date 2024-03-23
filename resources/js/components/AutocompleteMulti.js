import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';

class ReactTag extends Component {

  constructor(props) {
    super(props)

    this.state = {
      tags: [],
      suggestions: []
    }
  }

  handleDelete(i) {
    if (i === -1) return false;
     let tags = this.state.tags.filter((_, key) => key !== i);
    this.setState({
          tags: tags
    })

    {this.props.fn &&  tags.length > 0 && 
          this.props.fn(tags)
    }
  }

  handleAddition(tag) {
        let tags = [...this.state.tags.filter(x => x.name != tag.name), tag];
         this.setState({
            tags: tags
         })

        {this.props.fn &&  tags.length > 0 &&
          this.props.fn(tags)
        }
  }

  render() {
    return (
      <ReactTags
        tags={this.state.tags}
        suggestions={this.props.options}
        onDelete={this.handleDelete.bind(this)}
        onAddition={this.handleAddition.bind(this)}
        placeholderText={this.props.placeholder}
        allowNew='true'
        allowBackspace='true'
        />
    )
  }

}

export default ReactTag;