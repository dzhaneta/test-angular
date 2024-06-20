import { FilterPipe } from "./filter.pipe";

describe('FilterPipe', () => {

  let pipe: FilterPipe;

  const flatObjectsArr = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
    { id: 3, name: 'Bob', age: 40 }
  ];

  const nestedObjectsArr = [
    {
      id: 1,
      name: {surname: 'Khillian', name:'John', chineseName: 'Yuehan'},
      age: [{age: 30}, {asianAge: 31}]
    },
    {
      id: 2,
      name: {surname: 'Birgson', name:'Jane', chineseName: 'Jian'},
      age: [{age: 25}, {asianAge: 26}]
    },
    {
      id: 3,
      name: {surname: 'Thompson', name:'Bob', chineseName: 'Bao'},
      age: [{age: 40}, {asianAge: 41}]
    }
  ];

  const testCases = [
    {
      array: flatObjectsArr,
      filterKey: 'name',
      filterValue: 'Not selected',
      expectedResult: [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
        { id: 3, name: 'Bob', age: 40 }
      ]
    },
    {
      array: flatObjectsArr,
      filterKey: 'age',
      filterValue: '10',
      expectedResult: []
    },
    {
      array: flatObjectsArr,
      filterKey: 'name',
      filterValue: 'Jane',
      expectedResult: [
        { id: 2, name: 'Jane', age: 25 }
      ]
    },
    {
      array: nestedObjectsArr,
      filterKey: 'name',
      filterValue: 'Bob',
      expectedResult: [
        {
          id: 3,
          name: {surname: 'Thompson', name:'Bob', chineseName: 'Bao'},
          age: [{age: 40}, {asianAge: 41}]
        }
      ]
    },
    {
      array: nestedObjectsArr,
      filterKey: 'age',
      filterValue: '25',
      expectedResult: [
        {
          id: 2,
          name: {surname: 'Birgson', name:'Jane', chineseName: 'Jian'},
          age: [{age: 25}, {asianAge: 26}]
        }
      ]
    }
  ];

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
    expect(pipe.transform).toBeDefined();
  });

  it('should return the initial array if filter value is "Not selected"', () => {
    const filteredArray = pipe
      .transform(
        testCases[0].array,
        testCases[0].filterKey,
        testCases[0].filterValue
      );
    expect(filteredArray).toEqual(testCases[0].expectedResult);
  });

  it('should return empty array if no filter matching found', () => {
    const filteredArray = pipe
      .transform(
        testCases[1].array,
        testCases[1].filterKey,
        testCases[1].filterValue
      );
    expect(filteredArray).toEqual(testCases[1].expectedResult);
  });

  it(`should return ${JSON.stringify(testCases[2].expectedResult)} if filter key is ${testCases[2].filterKey}
    and filter value is ${testCases[2].filterValue} and objects array is flat`, () => {

    const filteredArray = pipe
      .transform(
        testCases[2].array,
        testCases[2].filterKey,
        testCases[2].filterValue
      );
    expect(filteredArray).toEqual(testCases[2].expectedResult);
  });

  it(`should return ${JSON.stringify(testCases[3].expectedResult)} if filter key is ${testCases[3].filterKey}
    and filter value is ${testCases[3].filterValue} and inital array has nested objects`, () => {

    const filteredArray = pipe
      .transform(
        testCases[3].array,
        testCases[3].filterKey,
        testCases[3].filterValue
      );
    expect(filteredArray).toEqual(testCases[3].expectedResult);
  });

  it(`should return ${JSON.stringify(testCases[4].expectedResult)} if filter key is ${testCases[4].filterKey}
    and filter value is ${testCases[4].filterValue} and initial array has nested objects arrays`, () => {

    const filteredArray = pipe
      .transform(
        testCases[4].array,
        testCases[4].filterKey,
        testCases[4].filterValue
      );
    expect(filteredArray).toEqual(testCases[4].expectedResult);
  });

});
