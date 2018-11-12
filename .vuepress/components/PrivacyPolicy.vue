<template>
    <b-row>
        <b-col>
            <b-jumbotron>
                <h3>Privacy policy</h3>
                <h5>What information do we collect?</h5>
                <p>
                    When you build a CryptoGift you are prompted to enter your and your receiver name.<br>
                    You will also insert a personal message to be shown to your CryptoGift receiver.<br>
                    The above information are encrypted using an encryption key you can choose during CryptoGift building or you can accepts our provided one-time encryption key.
                    Your data live on the blockchain but only who hold the key will be able to decrypt your message. It is safe from prying eyes.<br>
                    We do not collect your or your receiver address but we only use them to create the ERC721 Token representing your CryptoGift on the blockchain.
                    So, wallet addresses are visible on the blockchain using whatever explorer do you want so, if you understand the blockchain, you already know that we cannot hide these data.<br>
                    In the end the good news is that <u>we do not collect nothing of the above data</u>.<br>
                    We may collect data about your device and how you and your device interact with our App.
                    We may also collect data about your device and the network you use to connect to our App; this may include data such as browser type, operating system, and referring URLs.
                    Data are anonymized, we do not collect your IP and everything is deleted after 26 months so, do not worry about your data.
                </p>
                <h5>What do we use your information for?</h5>
                <p>
                    We use the data we collect to operate our business, and to make the App available to you. This includes using the data to improve our App, and to personalize your experiences.
                </p>
                <h5>How do we protect your information?</h5>
                <p>
                    We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
                    We offer the use of a secure server. All supplied sensitive information is transmitted via Secure Socket Layer (SSL) technology.<br>
                    Data transmitted and stored into the blockchain are encrypted using Advanced Encryption Standard (AES) and an encryption key known only by you.
                </p>
                <h5>How do we ensure that our processing systems remain confidential, resilient, and available?</h5>
                <p>
                    We implement a variety of measures to ensure that our processing systems remain confidential, resilient, and available.
                    CryptoGift is hosted on GitHub Pages.<br>
                    <small>
                        GitHub Pages is a static site hosting service designed to host your personal, organization, or project pages directly from a GitHub repository.
                        HTTPS enforcement is required for GitHub Pages sites using a github.io domain that were created after June 15, 2016.
                        HTTPS adds a layer of encryption that prevents others from snooping on or tampering with traffic to your site. You can enforce HTTPS for your GitHub Pages site to transparently redirect all HTTP requests to HTTPS.
                    </small><br>
                    By using GitHub Pages we guarantee that the code you are using is exactly the code stored in our repository. We cannot fraud.
                </p>
                <h5>Do we use cookies?</h5>
                <p>
                    We use Google Analytics. It may store some cookies. <br>
                    All the data we collect are anonymous and not user-specific.<br>
                    We do not use any other cookie.<br>
                    You may refuse to accept cookies by activating the setting on your browser that allows you to refuse the setting of cookies.
                </p>
                <h5>Do we disclose any information to outside parties?</h5>
                <p>Obviously not. We do not have information as explained above.</p>
                <h5>Third Party Links</h5>
                <p>
                    Occasionally, at our discretion, we may include or offer third party products or services on our website or through our App.<br>
                    If you access other websites using the links provided, the operators of these websites may collect information from you that will be used by them in accordance with their privacy policies.<br>
                    These third party sites have separate and independent privacy policies. We, therefore, have no responsibility or liability for the content and activities of these linked sites.<br>
                    Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
                </p>
                <h5>Changes to our Privacy Policy</h5>
                <p>
                    We will update this privacy statement when necessary to reflect customer feedback and changes to our App.<br>
                    If there are material changes to the statement or in how our App will use your personal data, we will notify you either by prominently posting a notice of such changes before they take effect.<br>
                    We encourage you to periodically review this privacy statement to learn how Dapper is protecting your information.
                </p>
                <h5>How to Contact Us</h5>
                <p>If you have a technical or support question, a privacy concern, complaint, or any type of question, please open an issue <b-link target="_blank" href="https://github.com/vittominacori/cryptogift/issues">here</b-link> or send a PM to <b-link target="_blank" href="https://twitter.com/vittominacori">@vittominacori</b-link>.</p>
            </b-jumbotron>
        </b-col>
    </b-row>
</template>

<script>
  export default {
    name: 'PrivacyPolicy',
  };
</script>
