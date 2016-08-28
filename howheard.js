'use strict';

/**
 * Module dependencies.
 */

var monk = require('monk');
var shopifyAPI = require('shopify-node-api');
var request = require('request');
var thunkify = require('thunkify');
var moment = require('moment-timezone');
var constants = require('./constants');



/**
 * Expose public API.
 */
exports.accessTokenExists = accessTokenExists;
exports.findShop = findShop;
exports.findOrCreate = findOrCreate;
exports.getAuthUrl = getAuthUrl;
exports.fetchAuthToken = fetchAuthToken;
exports.saveToken = saveToken;
exports.fetchShopFromShopify = fetchShopFromShopify;
exports.updateShop = updateShop;
exports.addShopifyOrderCreateWebhook = addShopifyOrderCreateWebhook;
exports.updateShopWithWebhook = updateShopWithWebhook;
exports.addShopifyUninstallWebhook = addShopifyUninstallWebhook;
exports.uninstallShop = uninstallShop;
exports.findHowHeardList = findHowHeardList;
exports.updateSelections = updateSelections;
exports.addSelections = addSelections;
exports.getHowHeardList = getHowHeardList;
exports.deleteSelection = deleteSelection;
exports.fetchSavedToken = fetchSavedToken;
exports.fetchCustomerFromShopify = fetchCustomerFromShopify;
exports.findShopById = findShopById;
exports.addUserSelection = addUserSelection;
exports.updateUserSelection = updateUserSelection;
exports.findUserSelection = findUserSelection;


/*
exports.findOrders = findOrders;
exports.saveNewShop = saveNewShop;
exports.saveConnection = saveConnection;
exports.updateConnection = updateConnection;
exports.shopifyMessageExists = shopifyMessageExists;
exports.saveShopifyMessage = saveShopifyMessage;
exports.makeHTTPRequest = makeHTTPRequest;
exports.saveSlackToken = saveSlackToken;
exports.daysOrders = daysOrders;
*/




/**
 * Connect to database.
 * Be sure to grab the right config var, as they can vary for mongodb 
 */

var db = monk(process.env.MONGODB_URI || 'localhost');





/**
 * Thunkify request methods.
 */

var post = thunkify(request.post);
var get = thunkify(request.get);






// Collection name must be unique on mLab db,
// so we can't use `shops`.
var shopsCollection = db.get('howHeardShops');
var listsCollection = db.get('howHeardLists');
var selectionCollection = db.get('howHeardSelections');




/**
 * Query DB with shop name
 * to check whether access token exists.
 *
 * @return {bool}
 * @api public
 */

function *accessTokenExists(shopName) {
  const shop = yield shopsCollection.findOne({
    companyName: shopName,
    accessToken: { $exists: true },
  });

  //  converting a value to a boolean, then inverting it, then inverting it again	
  return !!shop;
}





/**
 * Find a shop by its name.
 *
 * @return {object}
 * @api public
 */

function *findShop(shopName) {
  return yield shopsCollection.findOne({ companyName: shopName });
}





/**
 * Finds or create a shop based
 * on the given shop name.
 *
 * @return {object}
 * @api public
 */
function *findOrCreate(shopName) {
  const shop = yield findShop(shopName);
  if (shop) return shop;
  return yield shopsCollection.insert({
    companyName: shopName,
    connections: [],
  });
}





/**
 * Create a random character string.
 *
 * @return {String}
 * @api private
 */

function getRandomCode(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 20; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}





/**
 * Generate the URL needed for
 * the OAuth flow. See
 * https://docs.shopify.com/api/authentication/oauth.
 *
 * @return {String}
 * @api public
 * Grab Key & Secret from App Admin and add as config vars in Heroku 
 */

function getAuthUrl(shopName) {
  var nonce = getRandomCode(20);

  // Build config object
  var Shopify = new shopifyAPI({
    shop: shopName,
    shopify_api_key: constants.SHOPIFY_API_KEY,
    shopify_shared_secret: constants.SHOPIFY_API_SECRET,
    shopify_scope: ['read_orders', 'read_customers', 'write_customers'],
    redirect_uri: constants.HOWHEARD_PUBLIC_URL_ROOT + 'authenticate',
    nonce: nonce
  });

  // Create and return redirect URL.
  return Shopify.buildAuthURL();
}





/**
 * Continue the OAuth flow
 * by POSTing to Shopify
 * to get the auth token.
 *
 * @api public
 */

function fetchAuthToken(query) {
  return new Promise(function(resolve, reject) {

    var config = {
      code: query.code,
      hmac: query.hmac,
      shop: query.shop,
      shopify_api_key: constants.SHOPIFY_API_KEY,
      nonce: query.state,
      shopify_shared_secret: constants.SHOPIFY_API_SECRET,
      timestamp:query.timestamp
    }

    var Shopify = new shopifyAPI(config);

    Shopify.exchange_temporary_token(query, function(err, data){
      if (err) return reject(err);
      resolve(data.access_token)
    });
  });
}





/**
 * Save the auth token with
 * the shop it belongs to.
 *
 * @return {object} The updated shop.
 * @api public
 */

function *saveToken(token, shopName) {
  return yield shopsCollection.findAndModify(
    { companyName: shopName },
    { $set: { accessToken: token }
    }
  );
}





/**
 * @param {String} shopName
 * @param {String} token
 * @api public
 */
function *fetchShopFromShopify(shopName, token) {
  const options = {
    url: `https://${shopName}/admin/shop.json`,
    headers: {
      'X-Shopify-Access-Token': token,
    }
  }
  const responseAndBody = yield get(options);
  const response = responseAndBody[0];
  const body = responseAndBody[1];

  if (response.statusCode >= 400) {
    throw Error('Failed to fetch shop ' + body)
  }

  return JSON.parse(body);
}





/**
 * @param {String} shopName
 * @param {Object} update
 * @api public
 */

function *updateShop(shopName, update) {
  yield shopsCollection.update({
    companyName: shopName,
  }, {
    $set: { id: update.id,
            name: update.name ,
            email: update.email,
            domain: update.domain,
            created_at: update.created_at,
            province: update.province,
            country: update.country,
            address1: update.address1,
            zip: update.zip,
            city: update.city,
            phone: update.phone,
            shop_owner: update.shop_owner,
            plan_display_name: update.plan_display_name,
            myshopify_domain: update.myshopify_domain
          }
  });
}





/**
 * Adds an orderCreate webhook. This Shopify webhook
 * fires whenever an order is placed for the store
 *
 * @param {String} shopName
 * @param {String} token
 * @api public
 */
function *addShopifyOrderCreateWebhook(shopName, token) {
  const options = {
    url: `https://${shopName}/admin/webhooks.json`,
    body: JSON.stringify({
      webhook: {
        topic: 'orders/create',
        address: constants.HOWHEARD_PUBLIC_URL_ROOT+'messages/${shopName}/orderCreate',
        format: 'json',
      }
    }),
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    }
  };

  // Post returns an array [response, body]
  const responseAndBody = yield post(options);
  const response = responseAndBody[0];
  const body = responseAndBody[1];

  if (response.statusCode >= 400) {
    throw Error('Failed to set orderCreate webhook ' + response.body);
  }

  return JSON.parse(body);
}


function *updateShopWithWebhook(shopName, update) {
  yield shopsCollection.update({
    companyName: shopName,
  }, {
    $set: {
	  'connections.$.id': update.id,
      'connections.$.address': update.address,
      'connections.$.topic': update.topic,
      'connections.$.created_at': update.created_at
      'connections.$.shopifyEvent': 'orderCreate'
    }
  });
}





/**
 * Adds an uninstall webhook. This Shopify webhook
 * fires when a shop uninstalls our app.
 *
 * @param {String} shopName
 * @param {String} token
 * @api public
 */

function *addShopifyUninstallWebhook(shopName, token) {
  const options = {
    url: `https://${shopName}/admin/webhooks.json`,
    body: JSON.stringify({
      webhook: {
        topic: 'app/uninstalled',
        address: constants.HOWHEARD_PUBLIC_URL_ROOT+'uninstall',
        format: 'json',
      }
    }),
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    }
  };

  // Post returns an array [response, body]
  const responseAndBody = yield post(options);
  const response = responseAndBody[0];
  if (response.statusCode >= 400) {
    throw Error('Failed to set uninstall webhook ' + response.body);
  }
}





/**
 * Uninstall shop by removing its access and slack token
 * and clearing connections.
 *
 * @return {object} The updated shop
 * @api public
 */

 function *uninstallShop(shopName) {
  return yield shopsCollection.findAndModify({
    companyName: shopName,
  }, {
    $unset: { accessToken: ""  },
    $set: { connections: [] },
  });
 }





/**
 * See if How Heards already exist for the store
 *
 * @return {object}
 * @api public
 */

function *findHowHeardList(shopName) {
  const list = yield listsCollection.findOne({ companyName: shopName });

  //  converting a value to a boolean, then inverting it, then inverting it again	
  return !!list;
}





/**
 * See if How Heards already exist for the store
 *
 * @return {object}
 * @api public
 */

function *getHowHeardList(shopName) {
  return yield listsCollection.findOne({ companyName: shopName });
}





/**
 * @param {String} shopName
 * @param {array} selectionsArray
 * @api public
 */

function *updateSelections(shopName, selectionsArray) {
// can we update only if unique?
// what does 'issued' mean?
// what does the 'coupon' document look like?

  yield listsCollection.update({
      companyName: shopName
    }, {
      $addToSet: { selections: {$each: selectionsArray } },
  });


}





/**
 * @param {String} shopName
 * @param {array} selectionsArray
 * @api public
 */

function *addSelections(shopName, selectionsArray, insert) {

  yield listsCollection.insert({
      companyName: shopName,
      selections: selectionsArray,
    }, {
      $set: insert,
  });

}





/**
 * Delete How Heard selection
 *
 * @return {object} The updated shop
 * @api public
 */
function *deleteSelection(shopName, selectionChoice) {

  return yield listsCollection.findOneAndUpdate({
    companyName: shopName,
  }, {
    $pull: { selections: selectionChoice },
  });
	
 }





/**
 * Get the shopify API token for the shop
 *
 * @return {object} The updated shop
 * @api public
 */
function *fetchSavedToken(shopName) {
  return yield shopsCollection.findOne({ companyName: shopName });

}





/**
 * @param {String} email
 * @param {String} token
 * @api public
 */
function *fetchCustomerFromShopify(email, shopName, token) {
  const options = {
    url: `https://${shopName}/admin/customers/search.json?query=email:${email}`,
    headers: {
      'X-Shopify-Access-Token': token,
    }
  }

  const responseAndBody = yield get(options);
  const response = responseAndBody[0];
  const body = responseAndBody[1];

  console.log("SHOPIFY API URL", options.url);
  console.log("SHOPIFY API RETURNED", body);


  if (response.statusCode >= 400) {
    throw Error('Failed to fetch customer ' + body)
  }

  return JSON.parse(body);
}





/**
 * Find a shop by its id
 *
 * @return {object}
 * @api public
 */

function *findShopById(storeId) {
  return yield shopsCollection.findOne({ id: storeId });
}





/**
 *
 */

function *findUserSelection(shopName, custId) {
  const userSelection = yield selectionCollection.findOne(
	{ 
		companyName: shopName,
		customerId: custId
	});

  //  converting a value to a boolean, then inverting it, then inverting it again	
  return !!userSelection;
}





/**
 * @param {String} shopName
 * @param {Int} custId
 * @param {String} choice
 * @api public
 */

function *addUserSelection(shopName, custId, choice) {

  yield selectionCollection.insert(
	{
      companyName: shopName,
      customerId: custId,
      selection: choice,
    });

}





/**
 * @param {String} shopName
 * @param {Int} custId
 * @param {String} choice
 * @api public
 */

function *updateUserSelection(shopName, custId, choice) {

	  yield selectionCollection.update(
		{
	      companyName: shopName,
	      customerId: custId
	    }, {
	      $set: { selection: choice },
	  });
}





