import R from 'ramda';

// allLists :: [List] -> [String]
const allLists = R.compose(
  R.uniq,
  R.flatten,
  R.map( R.pluck( 'list' ) ),
  R.reject( R.isNil ),
  R.pluck( 'content' )
);

// numberOfCardsAtDate :: String -> String -> [List] -> Number
const numberOfCardsAtDate = ( list, date, data ) => {
  return R.compose(
    R.propOr( 0, 'numberOfCards' ),
    R.find( R.propEq( 'list', list ) ),
    R.propOr( 0, 'content' ),
    R.find( R.propEq( 'date', date ) )
  )( data );
};

// parsedValueAtDate :: String -> [List] -> String -> [Date, Number]
const parsedValueAtDate = R.curry( ( list, data, date ) => [
  new Date( date ).getTime(),
  numberOfCardsAtDate( list, date, data )
] );

// parseTrelloData :: [String] -> [List] -> [Graph]
const parseTrelloData = R.curry( ( displayedLists, data ) => {
  return R.compose(
    R.filter( ( data ) => R.contains( R.prop( "key", data ), displayedLists ) ),
    R.map( ( list ) => ({
      key: list,
      values: R.map( parsedValueAtDate( list, data ), R.pluck( 'date', data ) )
    }) ),
    allLists,
    R.defaultTo( [] )
  )( data );
} );

export {allLists, numberOfCardsAtDate, parseTrelloData};
