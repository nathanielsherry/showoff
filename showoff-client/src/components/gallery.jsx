import {NodeRenderer} from './base';
import {Icon, ListIcon} from './icon';

class GalleryImage extends NodeRenderer {

  render() {
    const src = '/api/image/' + this.spath();
    return (
      <div class='gallery-outer'>
        <style jsx>{`

          .gallery-outer {
            max-height: 100%;
            max-width: 100%;
            min-height: 0px;
            min-width: 0px;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .gallery {
            min-height: 0px;
          }
          .gallery-image {
            flex-grow: 1;
            flex-shrink: 1;
          
            border: 10px solid #FFFBF3;
            border-radius: 10px;
            box-shadow: 0px 0px 20px -10px #00000080;
            display: inline-block;
            margin: 20px;
            padding: 0px;
            height: 100%;
          
            object-fit: contain;
  
            min-width: 0px;
            max-width: calc(100% - 60px);
            
            min-height: 0px;
            max-height: calc(100% - 60px);
          }
        `}</style>
        <div class='gallery'>
          <img class='gallery-image' src={src} alt={this.title()}/>
        </div>
      </div>
    );
  }

}

class GalleryCollectionView extends NodeRenderer {

  get entries() {
    const entries = this.node.entries;
    const collections = entries.filter((e) => e.type === 'collection')
    const documents = entries.filter((e) => (!(e.type === 'collection')))
    return collections.concat(documents)
  }

}

class GalleryIconGrid extends GalleryCollectionView {

  renderIcon(link) {
    return (
      <Icon
        app={this.app}
        node={link}
      />
    );
  }

  render() {
    const entries = this.entries;
    const views = entries.map((l) => this.renderIcon(l));

    return (
      <div class='gallery-outer'>
        <style jsx>{`

          .gallery-outer {
            max-height: 100%;
            max-width: 100%;
            min-height: 0px;
            min-width: 0px;
            height: 100%;
            width: 100%;
            margin: 0px;
            overflow-y: auto;            
          }
          .gallery {
            min-height: 0px;
            justify-content: space-evenly;
            margin: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, 200px);
            grid-template-rows:    repeat(auto-fill, 200px);
          }
        `}</style>
        <div class='gallery'>
          {views}
        </div>
      </div>
    );
  }

}


class GalleryListing extends GalleryCollectionView {

  renderEntry(link) {
    return (
      <ListIcon
        app={this.app}
        node={link}
      />
    );
  }

  render() {
    const entries = this.entries;
    const views = entries.map((l) => this.renderEntry(l));
    return (
      <div class='gallery-outer'>
        <style jsx>{`
          .gallery-outer {
            max-height: 100%;
            max-width: 100%;
            min-height: 0px;
            min-width: 0px;
            width: 100%;
            margin: 0px;
            overflow-y: auto;
               
            display: flex;
            flex-direction: row;  
            justify-content: center;       
          }
          .gallery {
            min-height: 0px;
            justify-content: space-evenly;
            margin: 20px;
            overflow-y: auto;
            width: 800px;
            background: #FFFBF3;
            border: 5px solid #FFFBF3;
            border-radius: 5px;
            box-shadow: 0px 1px 5px -2px #00000080;
          }
        `}</style>
        <div class='gallery'>
          {views}
        </div>
      </div>
    );
  }

}

export {GalleryImage, GalleryIconGrid, GalleryListing}
