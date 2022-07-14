import {Search as JsSearch, AllSubstringsIndexStrategy} from 'js-search';

export class Search {
  jsSearch: JsSearch;

  constructor(ags) {
    this.jsSearch = new JsSearch(ags?.id ?? 'id');
    this.jsSearch.indexStrategy = new AllSubstringsIndexStrategy();
    if (ags?.indexes) {
      ags.indexes.forEach(index => {
        this.jsSearch.addIndex(index);
      });
    }
  }

  addIndex(indexes = []) {
    indexes.forEach(index => {
      this.jsSearch.addIndex(index);
    });
  }

  addData<T>(docs: T[] = []) {
    this.jsSearch.addDocuments(docs);
  }

  search<T>(e): T[] {
    return this.jsSearch.search(e) as T[];
  }
}
