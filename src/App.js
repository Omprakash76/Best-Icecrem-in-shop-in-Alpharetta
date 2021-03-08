import React, {useState} from "react"
import './App.css';

const key = "Ak07zIIcUXfYDi_tKPKgUpLFdmS5WfeouB4gSMqq7YMabL55xefp7NQeZ__FP03nc1M7dczcNAgmn3UssczirT6TyRph9jJ-JBAvgFTH6S64_8UCe6WLefcHU3FGYHYx"
function App() {
  const [shops, setShops] = useState([])
  const [showLoader, setShowLoader] = useState(true)

  React.useEffect(() => {
    (async ()=>{
      fetch("https://api.yelp.com/v3/businesses/search?term=best Ice cream&location=Alpharetta&limit=5&open_now=true&sort_by=rating", {
        headers: {
          Authorization: "Bearer " + key
        },
      }).then(response => response.json())
          .then(async (data) => {
              let shopsData = []
              for(let shop of data["businesses"]){
                  const data = await fetch(`https://api.yelp.com/v3/businesses/${shop.id}/reviews`, {
                      headers: {
                          Authorization: "Bearer " + key
                      },
                  }).then(response => response.json())
                  shopsData.push({...shop, ...data})
              }
              setShowLoader(false)
              setShops(shopsData)

          })
          .catch((error) => {
            console.error('Error:', error);
          });
    })();
  }, []);

  return (
    <div className="App">
      <h1>Five Best Ice Cream Shops in Alpharetta.</h1>
        {showLoader ? <img src="https://i.stack.imgur.com/ATB3o.gif" alt="loading..."/> : <div>
            {shops.map((shop) => {

                return (
                    <div style={{margin: 20}}>
                        <div>
                            <div className="profileimg">
                                <img className="img" src={shop.image_url}/>
                            </div>

                            <div className="artists-detail">
                                <div className="artists-name">
                                    <h2>Name : {shop.name}</h2>
                                    <sapn>Rating: {shop.rating}</sapn>
                                </div>

                                <div className="artists-rating">
                                    <span>phone : {`${shop?.display_phone}`}</span>
                                </div>
                                <div>
                                    <span>Address : {`${shop?.location.address1} ${shop?.location.city}`}</span>
                                </div>
                            </div>

                        </div>
                        {
                            shop.reviews &&
                            <div>
                                <div>
                                    <h3>Reviews</h3>
                                </div>
                                {shop.reviews.map((review) => <div>
                                    <div>
                                        <span><span
                                            style={{fontWeight: "bold"}}>Name : </span> {review["user"]?.name}</span>
                                    </div>
                                    <div>
                                        <span><span
                                            style={{fontWeight: "bold"}}>Rating :</span> {review["rating"]}</span>
                                    </div>
                                    <div>
                                        <p><span style={{fontWeight: "bold"}}>Text : </span>{review["text"]}</p>
                                    </div>
                                </div>)
                                }
                            </div>
                        }
                        <hr/>
                    </div>
                );
            })}
        </div>
        }
    </div>
  );
}

export default App;
