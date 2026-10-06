import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronRight, Menu, Search, X } from 'lucide-react';
import { useListPaymentNetworks } from 'payz-sdk';
import PayzLogo from './PayzLogo';
import PayzBrandText from './PayzBrandText';
import './documentation.css';

type DocSection = {
  title: string;
  body: string;
  bullets?: string[];
  flow?: string[];
};
type DocPage = {
  title: string;
  slug: string;
  summary: string;
  sections: DocSection[];
};
type DocGroup = { title: string; pages: DocPage[] };
const S = (title: string, body: string, bullets?: string[], flow?: string[]): DocSection => ({ title, body, bullets, flow });
const P = (title: string, slug: string, summary: string, ...sections: DocSection[]): DocPage => ({ title, slug, summary, sections });

const groups: DocGroup[] = [
  { title: 'Getting Started', pages: [
    P('Overview', 'overview', 'Payz helps people use cryptocurrency for real-world purchases while keeping payment activity and purchase context meaningfully separate.',
      S('A clearer way to spend crypto', 'Explore products and services, choose what you need, pay from an external wallet, and receive your purchase through Payz. The experience is designed for everyday use—not for navigating payment infrastructure.',
        ['Browse before deciding how to pay.', 'Review the product and total before checkout.', 'Follow clear payment and delivery updates.'],
        ['Discover', 'Choose', 'Pay', 'Payz processes', 'Settle', 'Fulfill', 'Receive']),
      S('Start with the product, then learn the details', 'These pages introduce the Payz experience, catalog, payment journey, and privacy model first. Developer concepts and API details are grouped separately for people building integrations.')),
    P('What Is Payz?', 'what-is-payz', 'Payz is a privacy-focused crypto spending platform for real-world products, services, subscriptions, entertainment, software, travel, food, shopping, and everyday needs.',
      S('Use crypto for things people actually buy', 'Payz connects product discovery, crypto payment, and purchase delivery in one customer experience. You browse Payz, select a real product and its available options, then pay from a wallet or exchange you already use. You do not need to connect a wallet to Payz.',
        ['Choose a product and region.', 'Select an available way to pay.', 'Receive the purchase through Payz after payment and fulfillment.']),
      S('Separate the payer from the purchase', 'Payz separates who pays from what gets purchased. The payment begins from your external wallet; the purchase is prepared through a separate Payz flow. This creates a privacy boundary between public wallet activity and a real-world purchase.')),
    P('Why Payz Exists', 'why-payz-exists', 'Public blockchains make transactions verifiable, but ordinary spending can reveal more about a person’s financial history than a purchase requires.',
      S('Everyday purchases deserve a privacy boundary', 'A public wallet can expose transaction history and relationships between addresses. Paying for an everyday service should not automatically turn that wider history into a purchase record. Payz is designed to minimize unnecessary disclosure between public wallet activity and real-world purchases.'),
      S('A reference about private commerce', 'Vitalik Buterin has written about the value of privacy in ordinary transactions, including the example: “Only Gladias and the restaurant knew that a 10.5 zipcoin order had been made.” This is an editorial reference to his writing, not an endorsement, partnership, or statement about Payz.',
        ['The point is separation: a purchase need not be directly announced by the customer’s public wallet.', 'Public networks remain verifiable according to their own rules.'])),
    P('How Payz Works', 'how-payz-works', 'From discovery to delivery, Payz guides a customer through product choice, a dedicated payment destination, payment processing, settlement, and fulfillment.',
      S('The customer journey', 'A customer finds a real product, chooses its available denomination and region, selects a supported payment method, and reviews the total. After checkout, Payz provides a dedicated destination and instructions for that purchase. The customer sends crypto from an external wallet or exchange; Payz detects and confirms payment, processes routing and settlement, fulfills the purchase, and delivers the result.',
        ['A route check while browsing is only a read-only availability check.', 'Only the final checkout action begins a purchase.', 'Payment confirmation and product delivery are separate milestones.'],
        ['Discover', 'Select', 'Pay', 'Payz processes', 'Settle', 'Fulfill', 'Receive']),
      S('A status at each stage', 'Payz distinguishes an incoming transfer from a confirmed payment and a fulfilled purchase. Customers can follow progress without mistaking “payment detected” for “purchase ready.”')),
    P('Getting Started', 'getting-started', 'Start by finding a product that fits your needs, checking its region and available denomination, then reviewing the payment options shown by Payz.',
      S('Before you begin', 'You need a product available for the country or region where it will be used, plus an external wallet or exchange that can send one of the displayed assets on the displayed network. Payz does not require you to connect that wallet.'),
      S('Your first purchase', 'Choose a product, confirm the denomination and total, select an available payment option, and read every instruction on the checkout screen before sending. Keep the purchase page open to follow payment and delivery progress.',
        ['Use only the network and asset shown for your checkout.', 'Send the amount shown for that purchase.', 'Wait for Payz to confirm payment and prepare delivery.'])),
  ]},
  { title: 'Product', pages: [
    P('Explore Payz', 'explore-payz', 'Payz brings real-world digital products and services into a catalog that can be explored before checkout.',
      S('Find something useful', 'Browse by category, search for a brand or product, and compare the options available for the region you select. Product names, artwork, prices, and availability come from the current Payz catalog.'),
      S('Availability can depend on region', 'A product can be listed for discovery while its purchase options differ by country. Open the product details to see the region, currency, denominations, and availability that apply to your choice.')),
    P('Real-World Products and Services', 'real-world-products', 'The Payz catalog covers digital products and services people use in daily life, including shopping, subscriptions, entertainment, software, travel, food, and more.',
      S('What you can find', 'Catalog examples include gift cards, digital subscriptions, gaming and entertainment products, travel-related services, and other regional offerings. The actual selection changes as the synchronized catalog changes.'),
      S('Choose products that are available now', 'Each product page presents real catalog options rather than invented denominations. Review the product description, region, currency, and available values before continuing to payment.')),
    P('Categories', 'categories', 'Categories make it easier to explore the products and services available through Payz.',
      S('Browse by need', 'Use the catalog categories to narrow the selection—for example shopping, food and beverage, entertainment, gaming, travel, lifestyle, sports, and services. A category is a way to explore, not a guarantee that every product is available in every region.'),
      S('A living catalog', 'Category names and included products follow the current Payz catalog. Availability and selection can change as products are updated, so rely on the product details shown when you make a purchase.')),
    P('Countries and Regions', 'countries-regions', 'A country or region can affect which products, currencies, denominations, and fulfillment options are available.',
      S('Choose where the product will be used', 'Select a real country supported by the product. Payz uses that choice to show the applicable product information and available purchase options. A broad “Global” browsing view can help with discovery, but it is not a country for fulfillment.'),
      S('Check the product details', 'Some brands operate in several markets while others are limited to one. Always confirm the region and currency on the product before checkout; the choice made for browsing does not replace the country required for fulfillment.')),
    P('Pricing', 'pricing', 'Payz displays real catalog denominations and calculates the customer-facing total separately from the crypto amount needed to pay.',
      S('Product value and customer total', 'Payz uses the product’s actual catalog denomination and applies its 10% markup to calculate the customer price. For example, a $50 product has a $5 Payz markup and a $55 customer total. Only denominations that actually exist in the catalog are offered.',
        ['The catalog minimum is $15; $15 and above are eligible when the real denomination exists.', 'There is no maximum product denomination.', 'Payz does not invent product prices or denominations.']),
      S('Crypto amount is a separate calculation', 'The product price is not a crypto payment minimum. The amount required in a selected asset is determined by the current payment quote and checkout instructions. It can differ from the product’s displayed fiat value.')),
    P('Rewards', 'rewards', 'Payz Rewards is presented as a coming-soon experience centered on tracking rewards based on PAYZ holdings.',
      S('The rewards direction', 'Rewards are intended to help customers follow rewards associated with PAYZ holdings. The current public Rewards experience is marked Coming soon; it does not promise an active earning rate, claim, payout, or redemption program.'),
      S('Follow published program details', 'When rewards are available, eligibility, calculations, and actions should be explained in the Payz product experience. Until then, do not treat an estimated balance or an unannounced rate as a reward entitlement.')),
  ]},
  { title: 'Payments', pages: [
    P('How Payments Work', 'how-payments-work', 'A Payz payment starts with a customer-confirmed checkout and continues through payment detection, confirmation, privacy-preserving routing, settlement, and fulfillment.',
      S('A deliberate checkout', 'Choose a product and payment option, review the total and instructions, then confirm checkout. The Payz Payment Engine checks current availability before preparing the dedicated destination for that purchase. Changing a product or amount while browsing does not create an exchange or payment order.'),
      S('From your wallet to delivery', 'Send the requested asset on the exact network shown. Payz follows the incoming transfer, verifies the payment, routes and settles value, and starts fulfillment. The purchase is delivered when fulfillment is complete.',
        ['Browsing checks are read-only.', 'Checkout checks availability again.', 'Payment and fulfillment have distinct statuses.'])),
    P('Supported Networks', 'supported-networks', 'The Payz payment catalog shows networks currently configured for customer payment choices; route availability is checked for the specific product amount.',
      S('Choose the exact network', 'A network is the blockchain context for a payment. Similar asset names can exist on different networks, so the network shown on the checkout screen is part of the payment instruction. A network in the catalog does not guarantee every product amount can use it.'),
      S('Current Payz network catalog', 'This list is read from the live Payz payment catalog. “Configured” means Payz can present that option; the route is still checked for the selected amount and again at checkout.')),
    P('Supported Assets', 'supported-assets', 'Payz lists payment assets together with their network, so customers can select the correct asset for a specific purchase.',
      S('An asset and network belong together', 'An asset is the cryptocurrency or token used to make a payment. The ticker alone is not enough to identify it: the same ticker can refer to different assets on different networks. Follow the pair presented by Payz.'),
      S('Current Payz asset catalog', 'The list below reflects assets currently enabled in Payz’s payment catalog. It does not promise that every asset can pay every amount; Payz checks the selected route when you choose an amount and repeats the check at checkout.')),
    P('Payment Addresses', 'payment-addresses', 'After checkout, Payz provides a dedicated payment destination and the exact network, asset, amount, and any additional instruction for that purchase.',
      S('Use the destination for this purchase only', 'A payment destination belongs to the checkout it was created for. Copy the complete instructions from the purchase page and use them only for that payment. Do not rely on an old or replaced destination.'),
      S('Check before sending', 'Confirm the network, asset, amount, destination, and any memo shown by Payz. Sending a different asset or using a different network can prevent the payment from matching the purchase.')),
    P('Payment Detection', 'payment-detection', 'Payment detection means Payz has observed an incoming transfer associated with the purchase. Payment confirmation, settlement, and fulfillment follow as separate stages.',
      S('Detected is an in-progress status', 'A transfer can appear on a network before Payz has completed its confirmation and settlement checks. The purchase is not ready just because activity has been detected.'),
      S('What to do next', 'Keep the purchase page available and follow its status. Do not send a second payment unless Payz explicitly asks you to do so, and do not assume delivery is ready until Payz says the purchase has been fulfilled.')),
    P('Payment Confirmation', 'payment-confirmation', 'Confirmation establishes that an incoming transfer matches the purchase instructions and has reached the required payment state.',
      S('Detection and confirmation are different', 'Detection reports that Payz observed activity. Confirmation checks that the transfer meets the requirements for the purchase. Settlement then verifies that the required value is ready before fulfillment proceeds.'),
      S('Allow the status to update', 'Network conditions can affect how long confirmation takes. Follow the status shown by Payz instead of relying on a fixed time estimate or treating an unconfirmed transfer as complete.')),
    P('Payment Status', 'payment-status', 'Payz shows payment progress separately from settlement and fulfillment so customers can see what has—and has not—finished.',
      S('Read each stage in context', 'Waiting means Payz is expecting the transfer. Detected means activity was observed. Confirming means verification is underway. Confirmed means the payment checks have completed; it does not, by itself, mean the product is ready.'),
      S('A purchase is ready after fulfillment', 'Settlement and product preparation happen after payment confirmation. Use the latest status shown on the purchase page and wait until delivery is marked ready before trying to redeem or access the product.')),
  ]},
  { title: 'Privacy', pages: [
    P('Payz Privacy Model', 'privacy-model', 'Payz uses zero-knowledge technology as part of a privacy architecture that separates the payment source from the real-world purchase.',
      S('A privacy boundary around spending', 'Payz separates who pays from what gets purchased. Customers pay from an external wallet to a dedicated Payz payment destination; the purchase is prepared through a separate Payz flow. Privacy-preserving payment routing and settlement minimize unnecessary disclosure between those contexts.',
        ['Fresh payment destinations help separate purchases.', 'The Payz Privacy Router and Payz Settlement Layer separate payment processing from fulfillment.', 'The Payz Privacy Layer uses zero-knowledge technology to support information separation.'],
        ['Customer wallet', 'Payz payment destination', 'Privacy-preserving routing', 'Payz settlement', 'Purchase fulfillment', 'Real-world product']),
      S('Privacy is not disappearance', 'Public networks remain verifiable according to their own rules. Payz creates separation and minimizes unnecessary disclosure; it does not claim that blockchain transactions vanish or become impossible to analyze.')),
    P('Privacy-Preserving Payment Routing', 'privacy-preserving-routing', 'The Payz Privacy Router separates the customer’s incoming payment from the downstream purchase and routes value through the Payz payment experience.',
      S('Keep payment context separate', 'The customer’s wallet funds a Payz checkout. Payz processes that payment and prepares the purchase separately, creating a privacy boundary between public wallet activity and the real-world product being fulfilled.'),
      S('Use zero-knowledge technology responsibly', 'Zero-knowledge technology is part of Payz’s privacy architecture: it supports verification of required conditions while minimizing unnecessary disclosure of underlying details. It complements payment routing and settlement; it is not a promise of universal anonymity.')),
    P('Settlement Privacy', 'settlement-privacy', 'Settlement is a distinct step between payment confirmation and fulfillment, helping separate the payment source from the product purchase.',
      S('A separate settlement step', 'Payz verifies that the value needed for a purchase is ready before the Payz Purchase Engine begins fulfillment. This separation means the customer’s source wallet does not directly submit the real-world product order.'),
      S('Privacy through separation', 'The Payz Settlement Layer works with privacy-preserving routing and zero-knowledge technology to minimize unnecessary links between payment activity and purchase context. Public transaction records retain the properties of their networks.')),
    P('Purchase Privacy', 'purchase-privacy', 'Payz protects access to fulfilled purchase details and keeps purchase delivery inside the Payz experience.',
      S('The purchase is delivered through Payz', 'After fulfillment is ready, customers receive access to the product details through Payz. This separates product delivery from the original public-wallet payment and keeps sensitive redemption information within the purchase flow.'),
      S('Keep personal purchase information private', 'Treat codes, PINs, and private redemption links as personal information. Share them only with the service where they are redeemed, and avoid posting them publicly or sending them to people you do not trust.')),
    P('Data Minimization', 'data-minimization', 'Payz is designed to use only the information needed to show a product, process a payment, complete fulfillment, and deliver the purchase.',
      S('Information should serve a clear purpose', 'A product choice, region, payment details, and delivery information each support a step in the customer experience. Payz’s privacy model limits unnecessary disclosure between those steps instead of turning one wallet transaction into a complete record of what a person buys.'),
      S('Keep sensitive details in the right place', 'Payment instructions are for the active purchase. Redemption codes, PINs, and private links belong in the protected delivery experience. Customers should avoid sharing screenshots or messages that expose those details.')),
    P('What Payz Does and Does Not Hide', 'what-payz-does-and-does-not-hide', 'Payz creates privacy-preserving separation around a purchase while remaining clear that public blockchains continue to record transactions.',
      S('What Payz is designed to separate', 'Payz separates payment from purchase, uses privacy-preserving routing and settlement, and uses zero-knowledge technology to minimize unnecessary disclosure between the customer’s payment context and product fulfillment.'),
      S('What remains visible', 'Depending on the network, public records can show wallet addresses, assets, amounts, and transaction times. Payz does not erase the underlying ledger or promise complete anonymity, invisible transactions, or guaranteed untraceability.',
        ['Privacy-preserving separation is not the same as hiding every public transaction.', 'Network activity may still be analyzed with information from outside Payz.', 'Payz minimizes unnecessary disclosure around purchases.'])),
  ]},
  { title: 'Purchases', pages: [
    P('Choosing a Product', 'choosing-a-product', 'Select a real product and an available denomination for the country or region where it will be used.',
      S('Compare the actual options', 'Review the product name, description, region, currency, and denominations displayed in Payz. Product options are based on the current catalog; Payz does not create values that the catalog does not offer.'),
      S('Check price and availability', 'The minimum catalog denomination is $15, with no maximum. A denomination is available only when the real product option exists. Review the final Payz price and payment choices before checkout.')),
    P('Creating a Purchase', 'creating-a-purchase', 'A purchase begins when you review a product and explicitly confirm checkout.',
      S('Review before continuing', 'Confirm the product, region, denomination, customer total, and selected payment method. Payz checks the selected product and current payment availability before preparing the dedicated payment destination.'),
      S('Checkout starts the purchase', 'A route check during browsing is not an order and does not reserve payment instructions. Only the final checkout action creates the purchase and provides instructions for paying.')),
    P('Payment and Fulfillment', 'payment-and-fulfillment', 'Payment and fulfillment are connected but separate stages: Payz confirms and settles the payment before preparing the product.',
      S('Payment comes first', 'Payz detects and confirms the incoming transfer, then verifies settlement. This ensures the value for the purchase is ready before fulfillment starts.'),
      S('Fulfillment prepares the product', 'The Payz Purchase Engine and Payz Fulfillment Engine prepare the selected product after settlement. A confirmed payment can still be followed by a processing step before the purchase is ready.')),
    P('Receiving Your Purchase', 'receiving-your-purchase', 'Payz makes the purchase available after fulfillment is complete and the delivery is ready.',
      S('Follow the delivery status', 'Keep the purchase page available while Payz processes the order. When the delivery is ready, open it from the Payz purchase flow and review the product-specific instructions.'),
      S('Save what you need', 'Some products include a code, link, PIN, instructions, or a downloadable document. Follow the delivery steps and save the information somewhere secure before leaving the page.')),
    P('Redemption Codes and Digital Products', 'redemption-codes-and-digital-products', 'Digital products can arrive as a redemption code, a link, a PIN, instructions, or another product-specific form of access.',
      S('Use the details for the intended service', 'Read the product instructions before redeeming. Check any listed region, validity period, and account requirements; different brands may use different redemption steps.'),
      S('Protect your redemption information', 'A code or PIN can provide access to value. Keep it private, enter it only on the intended service, and avoid sharing it in public posts, screenshots, or support messages.')),
    P('One-Time Purchase Access', 'one-time-purchase-access', 'Payz provides protected access to a completed purchase so customers can collect and save its delivery details.',
      S('Access belongs to the purchase', 'The purchase page is intended for the customer who completed that purchase. Open it from the Payz delivery flow, review the information, and complete the requested save or confirmation steps.'),
      S('Save before access ends', 'One-time access is designed to protect delivered information, not to serve as a permanent order-history page. Save codes, links, and documents you need before leaving the purchase flow.')),
  ]},
  { title: 'Developers', pages: [
    P('Developer Overview', 'developer-overview', 'Developers can use Payz’s public integration surface to present catalog choices, guide a customer through checkout, and show purchase progress.',
      S('Start with the customer experience', 'An integration should help customers discover a product, understand its price and availability, pay through Payz, and receive the fulfilled purchase. Keep product and payment choices clear before asking the customer to confirm checkout.'),
      S('Read the API Reference after the concepts', 'The API Reference is the technical contract for public endpoints. The rest of these docs describe the product and user journey without exposing internal service design.')),
    P('Integration Concepts', 'integration-concepts', 'A Payz integration connects catalog discovery, payment choice, explicit checkout, status updates, and protected delivery.',
      S('A customer-led integration', 'Read product options and payment choices from Payz, show the customer what they are selecting, and keep checkout behind an explicit confirmation. Treat availability as a point-in-time check, not a reservation.'),
      S('Keep progress and delivery distinct', 'Show payment progress separately from fulfillment. Use the values Payz returns, and only display redemption information when the purchase is ready. The API Reference defines the public request and response details.')),
    P('API Reference', 'api', 'Public Payz API endpoints for health, catalog discovery, payment choices, checkout, purchase delivery, and rewards.',
      S('About these endpoints', 'The entries below describe public routes and their current request and response contracts. Use the Payz responses rather than inventing product IDs, regions, asset identifiers, or status values.')),
    P('Authentication', 'authentication', 'Payz’s public purchase flow uses a browser guest context to associate checkout and order progress with the customer who began the purchase.',
      S('Customer context', 'Start a customer session before creating or reading a purchase. Preserve the session for that customer’s order journey; an order identifier by itself is not permission to see purchase details.'),
      S('Keep access credentials private', 'Do not expose a customer session or purchase-access token in logs, public pages, analytics, or support messages. The API Reference shows the authentication required by each public endpoint.')),
    P('Purchase Progress', 'webhooks', 'Follow each Payz purchase from payment detection through confirmation, settlement, fulfillment, and delivery.',
      S('Follow each stage', 'The protected purchase page keeps payment status and delivery progress together for that checkout. Use the latest status shown before taking the next action.'),
      S('Keep customer updates clear', 'Show payment confirmation, settlement, fulfillment, and delivery as distinct stages so customers know what has completed and what is still in progress.')),
    P('Errors', 'errors', 'A Payz error means an operation did not complete as requested; handle it by explaining the next safe action to the customer.',
      S('Respond to the situation, not server internals', 'Use the response contract for the relevant API operation. A customer-facing message should say whether to review a selection, try another available option, or check progress later.'),
      S('Do not turn errors into success', 'If a request fails or its result is uncertain, do not show a payment destination or delivery as ready unless Payz returned it. Avoid exposing private diagnostics or sensitive purchase information.')),
    P('Avoid Duplicate Payments', 'rate-limits', 'Use the current status and payment instructions for a purchase before repeating checkout or sending another transfer.',
      S('Check the purchase status', 'If a page is still processing, check its latest status before taking another action. Payment confirmation, settlement, and fulfillment are separate steps.'),
      S('Retry safely', 'If checkout does not return a clear result, verify the purchase status before creating another purchase. After sending funds, do not resend unless the purchase instructions explicitly require it.')),
  ]},
  { title: 'Guides', pages: [
    P('Make Your First Purchase', 'make-your-first-purchase', 'Use this walkthrough to make a purchase from product discovery through delivery.',
      S('Choose and review', 'Find a product, select the region where it will be used, and choose one of its real available denominations. Review the customer total and select a payment option Payz marks available for that purchase.'),
      S('Pay and receive', 'After checkout, copy the exact payment instructions and send from your external wallet or exchange. Follow Payz’s status updates, then open the delivery only when the purchase is ready.')),
    P('Pay With Crypto', 'pay-with-crypto', 'Pay from an external wallet or exchange by following the asset, network, amount, and destination shown for your Payz checkout.',
      S('Check every payment detail', 'Before sending, verify that the selected asset and network match the checkout and that the amount and destination are exact. Never substitute a similarly named token or a different network.'),
      S('Wait for confirmation', 'Payz updates the purchase as it detects and confirms payment, completes settlement, and fulfills the product. Do not send another transfer simply because the page is still processing.')),
    P('Understand Payment Status', 'understand-payment-status', 'Payment status explains where your transfer is in the Payz process; it does not always mean the product is ready.',
      S('Common progress stages', 'Waiting means Payz expects a transfer. Detected means activity has been observed. Confirming means payment checks are in progress. Confirmed means those checks have finished.'),
      S('Payment is not the final delivery stage', 'After payment confirmation, settlement and fulfillment can still be in progress. Follow the purchase page until it says delivery is ready.')),
    P('Handle a Failed Payment', 'handle-failed-payment', 'If Payz says the selected payment route is unavailable, pause before sending and choose another option shown for the purchase.',
      S('Before sending', 'A read-only availability check can change before checkout. If checkout cannot confirm the route, Payz should not provide payment instructions for that attempt. Choose another supported asset, network, or product option and review the new instructions.'),
      S('After sending', 'If you already sent crypto, keep the purchase page and transaction information available and follow the status shown by Payz. Do not send a second payment or assume a refund outcome unless Payz confirms the next step.')),
    P('Understand Purchase Fulfillment', 'understand-purchase-fulfillment', 'Fulfillment is the stage when Payz prepares the product after payment and settlement are complete.',
      S('Processing can continue after payment', 'A confirmed payment means the payment checks finished; it does not mean the product has already been delivered. Payz may still need to prepare or verify the product-specific result.'),
      S('Wait for ready status', 'Open product details only after Payz marks delivery ready. If the purchase is still processing, follow the current status rather than repeating checkout.')),
    P('Integrate Payz', 'integrate-payz', 'Build a customer-first integration that reads Payz catalog choices, confirms intent, shows payment progress, and protects delivered product information.',
      S('Connect the experience', 'Use the API Reference for public request and response contracts. Build the interface around the customer’s selected product, region, denomination, and payment option.'),
      S('Protect purchase access', 'Preserve the customer context, show accurate progress, and reveal delivery details only when Payz marks the purchase ready. Never expose access credentials or redemption values in public telemetry.')),
  ]},
  { title: 'Reference', pages: [
    P('Payment States', 'payment-states', 'Payment states describe the transfer’s progress; they should not be confused with order completion or product delivery.',
      S('Read payment progress', 'Waiting, detected, confirming, and confirmed describe stages from expected transfer through completed payment checks. Use the exact value returned by Payz for an individual purchase.'),
      S('Separate payment from fulfillment', 'Settlement and fulfillment follow payment confirmation. A confirmed payment is not proof that a product is ready to redeem.')),
    P('Purchase States', 'purchase-states', 'Purchase states describe the wider journey from customer checkout to product delivery.',
      S('A purchase has several milestones', 'Checkout, payment, settlement, product preparation, and delivery each represent different progress. Payz keeps those steps distinct so customers know what is complete and what remains.'),
      S('Show the latest purchase update', 'Use the status shown by Payz, not an assumption based on elapsed time or the presence of a purchase. Delivery is complete when the product is marked ready.')),
    P('Asset Types', 'asset-types', 'Payz identifies a payment asset by its displayed name, ticker, and network association.',
      S('Native assets and tokens', 'A native asset is the primary asset of a network; a token is issued or represented on a network. Payz may show an asset classification where it is useful, but customers should choose by the full asset and network shown in checkout.'),
      S('The type does not guarantee availability', 'Asset classification does not mean the asset can be used for every purchase. Payz checks the selected route for the actual product amount.')),
    P('Network Types', 'network-types', 'A payment network identifies the blockchain context in which the selected asset is sent.',
      S('The network is part of the instruction', 'Addresses and payment conditions depend on the network. Always use the exact network shown by Payz, even when another network supports an asset with the same name.'),
      S('Do not assume cross-network recovery', 'A transfer sent on a different network may not match the purchase instructions. Payz does not promise automatic recovery or bridging for a misdirected payment.')),
    P('Glossary', 'glossary', 'Plain-language definitions for the terms used in Payz product, payment, privacy, and delivery pages.',
      S('Product and payment terms', 'Payz: a platform for using crypto to purchase real-world products and services. Payment destination: the address or instruction shown for a specific checkout. Payment asset: the cryptocurrency or token used to pay. Payment network: the blockchain on which that asset is sent. Payment routing: processing a confirmed payment toward settlement. Settlement: verifying that the value for a purchase is ready before fulfillment.'),
      S('Privacy and delivery terms', 'Fulfillment: preparing the selected product after payment. Redemption code: a value used to claim or activate a digital product. Privacy Layer: Payz architecture that separates payment and purchase contexts. Zero-knowledge technology: cryptographic techniques that can verify conditions while limiting what details are disclosed. External wallet: a wallet or exchange account outside Payz. Confirmation: verification that a transfer meets the purchase requirements. Payment status: the current stage of a transfer.')),
  ]},
  { title: 'Security', pages: [
    P('Security Overview', 'security-overview', 'Payz protects payment instructions, customer purchase context, and delivered product information throughout the purchase experience.',
      S('Protect each stage', 'Customers should use the exact payment instructions for a checkout and keep redemption information private. Payz separates payment processing from product delivery and makes purchase details available through the purchase experience.'),
      S('Public-network transparency', 'Payz’s privacy architecture uses zero-knowledge technology and privacy-preserving routing to minimize unnecessary disclosure. Public blockchain records remain verifiable under each network’s rules.')),
    P('Payment Security', 'payment-security', 'Payz checks payment choices before checkout and verifies payment and settlement before product fulfillment.',
      S('Check before sending', 'Confirm the product, amount, asset, network, and destination on the checkout page. An availability result shown while browsing can change; follow the fresh instructions provided when you check out.'),
      S('Keep payment and delivery distinct', 'A detected transfer is not yet a confirmed payment, and a confirmed payment is not yet a delivered product. Follow Payz’s status and open delivery only when it is ready.')),
    P('Data Handling', 'data-handling', 'Payz uses product, payment, and delivery information to complete a purchase while minimizing unnecessary disclosure between those contexts.',
      S('Information has a purpose', 'Product selection and region determine what can be purchased; payment details allow Payz to confirm and settle the transfer; fulfillment details allow the customer to receive the product. Payz’s privacy model limits the information passed between these parts of the experience.'),
      S('Protect sensitive delivery details', 'Codes, PINs, private links, and access details can carry value. Keep them in a secure place and share them only with the service that needs them.')),
    P('API Security', 'api-security', 'Developers should preserve customer context, validate every payment instruction, and protect credentials and purchase details in their integrations.',
      S('Use only the public API contract', 'Follow the API Reference for authentication, request, and response requirements. Do not invent access schemes or expose credentials in browser code, logs, screenshots, or analytics.'),
      S('Limit access to purchase data', 'An order identifier is not a substitute for authorization. Protect session and purchase-access credentials, and display delivery information only for the customer and purchase that are authorized to receive it.')),
  ]},
];

const allPages = groups.flatMap(group => group.pages.map(item => ({ ...item, group: group.title })));
export const DOC_ROUTES = ['/docs', ...allPages.map(item => `/docs/${item.slug}`)];
const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/docs';

type ApiEndpointDoc = {
  method: 'GET' | 'POST'; path: string; purpose: string; auth: string;
  params: string; body: string; response: string; errors: string;
};
const apiEndpoints: ApiEndpointDoc[] = [
  { method:'GET',path:'/api/healthz',purpose:'Check whether the Payz API is responding.',auth:'Public; no customer session required.',params:'None.',body:'None.',response:'200 JSON: { status: "ok" }.',errors:'No endpoint-specific error contract is declared.' },
  { method:'GET',path:'/api/catalog/regions',purpose:'List regions present in the current Payz catalog.',auth:'Public.',params:'None.',body:'None.',response:'200 JSON array of regions: code, name, currency, currencySymbol.',errors:'503 if catalog data is unavailable; { error, code }.' },
  { method:'GET',path:'/api/catalog/categories',purpose:'List catalog categories, optionally scoped to a region.',auth:'Public.',params:'Optional query: region (string).',body:'None.',response:'200 JSON array of categories: id, name.',errors:'400 for invalid region/query; 503 if catalog data is unavailable.' },
  { method:'GET',path:'/api/catalog/home',purpose:'Return product sections for the selected browsing region.',auth:'Public.',params:'Optional query: region (string); omit for the default browsing scope.',body:'None.',response:'200 JSON: globalTop, regionalTop, categorySections.',errors:'400 for an unsupported region; 503 if catalog data is unavailable.' },
  { method:'GET',path:'/api/catalog/products',purpose:'Search and paginate catalog products.',auth:'Public.',params:'Optional region, category, search, currency; page (integer ≥1); pageSize (1–50).',body:'None.',response:'200 JSON: products, page, pageSize, total, totalPages.',errors:'400 for invalid query or region; 503 if catalog data is unavailable.' },
  { method:'GET',path:'/api/catalog/product',purpose:'Read a product and its variant for the selected region.',auth:'Public.',params:'Required productId; optional region.',body:'None.',response:'200 JSON product: id, variantId, brand, name, description, category, region, currency, startingPrice, denominations, range, regions, availability, artwork identifiers.',errors:'400 invalid query; 404 unavailable in region; 503 catalog unavailable.' },
  { method:'GET',path:'/api/payments/networks',purpose:'List Payz payment networks and their configured assets.',auth:'Public.',params:'None.',body:'None.',response:'200 JSON array of networks (id, code, name, logoUrl, enabled, available, assets); assets include id, ticker, name, assetType, contractAddress, decimals, logoUrl, enabled, configured, available, status, availabilityReason, sortOrder.',errors:'503 if the payment catalog is unavailable.' },
  { method:'GET',path:'/api/payments/availability',purpose:'Check current payment-route status for a product and denomination. Read-only; does not create a purchase or payment destination.',auth:'Public.',params:'Required productId (string), region (two-character string), denomination (>0).',body:'None.',response:'200 JSON: productId, region, denomination, checkedAt, routes[]; each route has networkId, assetId, status.',errors:'400 invalid query; 404 product amount unavailable; 503 catalog or route check unavailable.' },
  { method:'POST',path:'/api/session',purpose:'Establish or resume a customer guest context for purchase operations.',auth:'Public bootstrap; response sets the customer session cookie.',params:'None.',body:'None.',response:'200 JSON: { ready: boolean } plus session cookie.',errors:'503 if session setup is unavailable.' },
  { method:'POST',path:'/api/orders',purpose:'Create a purchase and its payment instructions after explicit checkout.',auth:'Required: customer guest session.',params:'None.',body:'JSON: productId, region, denomination, networkId, assetId, idempotencyKey (UUID).',response:'201 JSON order: orderId, orderStatus, paymentStatus, fulfillmentStatus, product, region, fiatAmount, fiatCurrency, payment, events, createdAt, updatedAt.',errors:'400 invalid order or asset/network pair; 404 product unavailable; 409 checkout still processing or idempotency key reused for a different purchase; 503 route or order service unavailable.' },
  { method:'GET',path:'/api/orders/{orderId}',purpose:'Read a purchase and its customer-facing progress.',auth:'Required: the session that owns the order.',params:'Path: orderId (string).',body:'None.',response:'200 JSON order: orderId, orderStatus, paymentStatus, fulfillmentStatus, product, region, fiatAmount, fiatCurrency, payment, events, createdAt, updatedAt.',errors:'400 invalid order ID; 404 not found in the current customer session; 503 order details temporarily unavailable.' },
  { method:'POST',path:'/api/orders/{orderId}/purchase-access',purpose:'Issue protected access to a completed purchase.',auth:'Required: the session that owns the order.',params:'Path: orderId (string).',body:'None.',response:'200 JSON: { purchaseToken: string }.',errors:'404 if the purchase is not ready or access is unavailable.' },
  { method:'GET',path:'/api/purchase/{purchaseToken}',purpose:'Read non-sensitive details about an active purchase delivery.',auth:'The purchase token is the access credential; keep it private.',params:'Path: purchaseToken.',body:'None.',response:'200 JSON purchase details: brand, productName, amount, currency, region, payment summary, delivery/download availability.',errors:'404 if access is invalid, expired, consumed, or the purchase is not ready.' },
  { method:'POST',path:'/api/purchase/{purchaseToken}/reveal',purpose:'Reveal fulfilled redemption details for an active purchase.',auth:'Purchase token required; keep it private.',params:'Path: purchaseToken.',body:'None.',response:'200 JSON: redemptionCode, redemptionUrl, redemptionPin, redemptionInstructions, expirationDate; values may be null.',errors:'404 if access is unavailable or the purchase is not ready.' },
  { method:'POST',path:'/api/purchase/{purchaseToken}/events',purpose:'Record a supported, non-sensitive delivery action.',auth:'Purchase token required; keep it private.',params:'Path: purchaseToken.',body:'JSON eventType: CODE_COPIED, FILE_DOWNLOAD_STARTED, FILE_DOWNLOAD_COMPLETED, or REDEMPTION_LINK_OPENED.',response:'200 JSON: { recorded: boolean }.',errors:'404 if the token, event type, or purchase access is unavailable.' },
  { method:'GET',path:'/api/purchase/{purchaseToken}/download',purpose:'Download a PDF when the purchase has downloadable details.',auth:'Purchase token required; keep the URL private.',params:'Path: purchaseToken.',body:'None.',response:'200 application/pdf containing purchase details and available fulfilled content.',errors:'404 if access or downloadable content is unavailable.' },
  { method:'POST',path:'/api/purchase/{purchaseToken}/consume',purpose:'End one-time access after the customer confirms the delivery actions are complete.',auth:'Purchase token required; keep it private.',params:'Path: purchaseToken.',body:'JSON booleans: copiedCode, downloadedFile, savedInformation.',response:'200 JSON: { consumed: boolean }.',errors:'400 if required confirmations are incomplete; 404 if access is unavailable.' },
  { method:'GET',path:'/api/rewards',purpose:'Rewards API route; the customer Rewards experience is coming soon.',auth:'Public.',params:'None.',body:'None.',response:'This route currently returns 503; there is no active rewards summary response.',errors:'503 rewards unavailable.' },
];

function ApiReference() {
  return <section className="docs-api-reference" aria-labelledby="docs-api-reference-title">
    <div className="docs-api-reference-heading">
      <h2 id="docs-api-reference-title">Public endpoint reference</h2>
      <p><PayzBrandText text="Only public Payz API routes are listed here. The contract may evolve; follow the fields and status values returned by the API." /></p>
    </div>
    {apiEndpoints.map(endpoint => <article className="docs-api-card" key={`${endpoint.method}-${endpoint.path}`}>
      <div className="docs-api-card-head"><span className={`docs-api-method docs-api-method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span><code>{endpoint.path}</code></div>
      <p className="docs-api-purpose"><PayzBrandText text={endpoint.purpose} /></p>
      <dl className="docs-api-fields">
        <div><dt>Authentication</dt><dd><PayzBrandText text={endpoint.auth} /></dd></div><div><dt>Parameters</dt><dd><PayzBrandText text={endpoint.params} /></dd></div>
        <div><dt>Request body</dt><dd><PayzBrandText text={endpoint.body} /></dd></div><div><dt>Response</dt><dd><PayzBrandText text={endpoint.response} /></dd></div>
        <div><dt>Error behavior</dt><dd><PayzBrandText text={endpoint.errors} /></dd></div>
      </dl>
    </article>)}
  </section>;
}

export function DocumentationSite() {
  const [location] = useLocation();
  const path = normalizePath(location);
  const active = allPages.find(item => `/docs/${item.slug}` === path) ?? allPages[0];
  const [openGroups, setOpenGroups] = useState<string[]>([active.group]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const networksQuery = useListPaymentNetworks({ query: { queryKey: ['/api/payments/networks'], enabled: active.slug === 'supported-networks' || active.slug === 'supported-assets', staleTime: 30_000 } });
  const networks = networksQuery.data ?? [];
  useEffect(() => setOpenGroups([active.group]), [active.group]);
  useEffect(() => { setMobileOpen(false); setQuery(''); }, [path]);
  useEffect(() => { document.querySelector<HTMLElement>('.docs-main')?.scrollTo({ top: 0, behavior: 'auto' }); }, [path]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setSearchFocused(false); setMobileOpen(false); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); document.querySelector<HTMLInputElement>('[data-testid="input-doc-search"]')?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return allPages.map(item => {
      const apiText = item.slug === 'api' ? apiEndpoints.map(endpoint => `${endpoint.method} ${endpoint.path} ${endpoint.purpose}`).join(' ') : '';
      const text = `${item.title} ${item.group} ${item.summary} ${item.sections.map(section => `${section.title} ${section.body} ${(section.bullets ?? []).join(' ')} ${(section.flow ?? []).join(' ')}`).join(' ')} ${apiText}`.toLowerCase();
      return { item, text, score: item.title.toLowerCase().includes(term) ? 3 : 1 };
    }).filter(result => result.text.includes(term)).sort((a,b) => b.score - a.score).slice(0, 8);
  }, [query]);
  const currentIndex = allPages.findIndex(item => item.slug === active.slug);
  const prev = allPages[currentIndex - 1], next = allPages[currentIndex + 1];
  const toggleGroup = (title: string) => setOpenGroups(current => current.includes(title) ? current.filter(item => item !== title) : [...current, title]);
  return <div className="payz-docs" data-testid="page-documentation">
    <header className="docs-topbar">
      <button className="docs-mobile-menu" type="button" onClick={() => setMobileOpen(open => !open)} aria-label={mobileOpen ? 'Close documentation navigation' : 'Open documentation navigation'} aria-expanded={mobileOpen} data-testid="button-docs-menu">{mobileOpen ? <X /> : <Menu />}</button>
      <Link className="docs-brand" href="/" aria-label="payz home"><PayzLogo decorative /><span className="docs-brand-word">payz</span></Link>
      <div className="docs-search-wrap"><Search className="docs-search-icon" aria-hidden="true" />
        <input className="docs-search" type="search" value={query} placeholder="Search documentation…" aria-label="Search documentation" data-testid="input-doc-search" onChange={event => setQuery(event.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => window.setTimeout(() => setSearchFocused(false), 130)} />
        <span className="docs-search-shortcut">⌘ K</span>
        {searchFocused && query.trim() && <div className="docs-search-results" role="listbox" data-testid="list-doc-search-results">
          {results.length ? results.map(({ item }) => <Link key={item.slug} className="docs-search-result" href={`/docs/${item.slug}`} onMouseDown={event => event.preventDefault()} data-testid={`link-search-${item.slug}`}><strong><PayzBrandText text={item.title} /></strong><span>{item.group} · /docs/{item.slug}</span></Link>) : <div className="docs-search-empty">No matching page. Try a product, payment, privacy, or developer topic.</div>}
        </div>}
      </div>
    </header>
    <div className={`docs-overlay ${mobileOpen ? 'is-open' : ''}`} onClick={() => setMobileOpen(false)} aria-hidden="true" />
    <div className="docs-layout">
      <aside className={`docs-sidebar ${mobileOpen ? 'is-open' : ''}`} aria-label="Documentation navigation">
        <p className="docs-nav-caption"><PayzBrandText text="Payz Guide" /></p>
        {groups.map(group => <section className="docs-nav-group" key={group.title}>
          <button type="button" className="docs-group-button" aria-expanded={openGroups.includes(group.title)} onClick={() => toggleGroup(group.title)} data-testid={`button-doc-group-${group.title.toLowerCase().replaceAll(' ','-')}`}>{group.title}<ChevronRight aria-hidden="true" /></button>
          {openGroups.includes(group.title) && <nav className="docs-group-list" aria-label={group.title}>
            {group.pages.map(item => <Link key={item.slug} href={`/docs/${item.slug}`} className="docs-nav-link" aria-current={active.slug === item.slug ? 'page' : undefined} data-testid={`link-doc-${item.slug}`}><PayzBrandText text={item.title} /></Link>)}
          </nav>}
        </section>)}
      </aside>
      <main className="docs-main">
        <div className="docs-content"><div className="docs-content-grid">
          <article className="docs-article" data-testid={`content-doc-${active.slug}`}>
            <div className="docs-breadcrumb"><Link href="/docs">Docs</Link><ChevronRight aria-hidden="true" size={12} /><span>{active.group}</span></div>
            <h1><PayzBrandText text={active.title} /></h1><p className="docs-lede"><PayzBrandText text={active.summary} /></p>
            {active.sections.map((section, index) => <section className="docs-section" id={`section-${index}`} key={section.title}>
              <h2><PayzBrandText text={section.title} /></h2><p><PayzBrandText text={section.body} /></p>
              {section.bullets && <ul>{section.bullets.map(bullet => <li key={bullet}><PayzBrandText text={bullet} /></li>)}</ul>}
              {section.flow && <div className="docs-flow" role="img" aria-label={section.flow.join(' then ').replace(/\b(Payz|payZ|payz)\b/g, 'payz')}>{section.flow.map((step, stepIndex) => <div className="docs-flow-step" key={`${step}-${stepIndex}`}><span>{String(stepIndex + 1).padStart(2, '0')}</span><strong><PayzBrandText text={step} /></strong></div>)}</div>}
            </section>)}
            {(active.slug === 'supported-networks' || active.slug === 'supported-assets') && <section className="docs-live-catalog" aria-live="polite">
              <h2><PayzBrandText text={active.slug === 'supported-networks' ? 'Networks in Payz' : 'Assets in Payz'} /></h2>
              {networksQuery.isLoading ? <p>Loading the current <PayzBrandText text="Payz" /> payment catalog…</p> : networksQuery.isError ? <p>The payment catalog is temporarily unavailable. Please try again later.</p> : active.slug === 'supported-networks' ? <ul>{networks.filter(network => network.enabled).map(network => <li key={network.id}><strong>{network.name}</strong>{network.available ? ' — has enabled payment assets' : ' — not currently selectable'}</li>)}</ul> : <ul>{networks.flatMap(network => network.assets.filter(asset => asset.enabled).map(asset => <li key={asset.id}><strong>{asset.name} ({asset.ticker})</strong> — {network.name}{asset.available ? '' : ' · not currently selectable'}</li>))}</ul>}
              <p className="docs-catalog-note"><PayzBrandText text="Catalog configuration is not a guarantee that a route works for every product amount. Payz checks availability for the selected amount and checks again at checkout." /></p>
            </section>}
            {active.slug === 'api' && <ApiReference />}
            <div className="docs-page-footer">
              {prev ? <Link href={`/docs/${prev.slug}`} data-testid="link-previous-doc"><span>Previous</span>← <PayzBrandText text={prev.title} /></Link> : <span />}
              {next ? <Link href={`/docs/${next.slug}`} data-testid="link-next-doc"><span>Next</span><PayzBrandText text={next.title} /> →</Link> : <span />}
            </div>
          </article>
          <aside className="docs-toc" aria-label="On this page"><p className="docs-toc-title">On this page</p>
             {active.sections.map((section,index) => <a href={`#section-${index}`} key={section.title}><PayzBrandText text={section.title} /></a>)}
            {active.slug === 'api' && <a href="#docs-api-reference-title">Public endpoint reference</a>}
          </aside>
        </div></div>
      </main>
    </div>
  </div>;
}
