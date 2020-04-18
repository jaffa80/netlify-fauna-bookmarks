
require('dotenv').config();
var faunadb = require('faunadb'),
    q = faunadb.query;

var adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_ISOTT
});

// Query that works in 
// Map(
//   Paginate(
//     Match(Index("routeEvent_by_endDate")),
//     { after: ToDate(Now()) }
//   ),
//   Lambda("x", Get(Select(1, Var("x"))))
// )

function getRouteEvents() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today =yyyy +'-'+ mm +'-'+ dd;
  // document.write(today);
    console.log(today);
    let td = q.ToDate(today);
    console.log(td);
    return adminClient.query(q.Map(q.Paginate(
        q.Match(
            q.Index("routeEvent_by_endDate"))
            , {after: q.ToDate(today)}
        ),
        q.Lambda("x", q.Get(q.Select(1, q.Var("x"))))
    ))
    .then((response) => {
        const linkRefs = response.data;
        console.log("linkRefs");
        const upcomingEvents = linkRefs.map((ref) => {
          console.log(ref);  
          return q.Get(ref)
        })

          
        return adminClient.query(upcomingEvents).then(ret => {
          console.log("upcomingEvents)");
            return ret
        })
    }).catch(error => {
        return error
    })
}


module.exports = async function() {
    const data = await getRouteEvents();

    return data;
    
}