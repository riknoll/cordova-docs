var React = require('react'),
    PlatformButton = require('./platformbutton.jsx')

var SupportedPlatforms = React.createClass({
    getInitialState: function() {
        return {
            moreClicked: false
        };
    },
    onClick: function() {
        this.setState({
            moreClicked: true
        });
    },
    render: function() {
        var keywords = this.props.keywords;
        var sortedMajorPlatforms = [
            {present:false, text: "Android", keyword:"cordova-android"},
            {present:false, text: "iOS", keyword:"cordova-ios"},
            {present:false, text: "Windows", keyword:"cordova-windows"},
            {present:false, text: "Blackberry10", keyword:"cordova-blackberry10"}
        ];
        var majorPlatformsSupported = [];
        var otherPlatformsSupported = [];
        // remove windows8 & windows dupe
        if (keywords.indexOf('cordova-windows') > -1 && keywords.indexOf('cordova-windows8') > -1) {
            keywords.splice(keywords.indexOf('cordova-windows8'), 1);
        }
        keywords.forEach(function(keyword) {
            switch (keyword) {
                case 'cordova-firefoxos':
                    otherPlatformsSupported.push(<PlatformButton platform="FirefoxOS" keyword={keyword} />);
                    break;
                case 'cordova-android':
                    sortedMajorPlatforms[0].present = true;
                    break;
                case 'cordova-amazon-fireos':
                    otherPlatformsSupported.push(<PlatformButton platform="FireOS" keyword={keyword} />);
                    break;
                case 'cordova-ubuntu':
                    otherPlatformsSupported.push(<PlatformButton platform="Ubuntu" keyword={keyword} />);
                    break;
                case 'cordova-ios':
                    sortedMajorPlatforms[1].present = true;
                    break;
                case 'cordova-blackberry10':
                    sortedMajorPlatforms[3].present = true;
                    break;
                case 'cordova-wp8':
                    otherPlatformsSupported.push(<PlatformButton platform="Windows Phone 8" keyword={keyword} />);
                    break;
                case 'cordova-windows8':
                case 'cordova-windows':
                    sortedMajorPlatforms[2].present = true;
                    break;
                case 'cordova-browser':
                    otherPlatformsSupported.push(<PlatformButton platform="Browser" keyword={keyword} />);
                    break;
            }
        });

        sortedMajorPlatforms.forEach(function(platform) {
            if(platform.present) {
                majorPlatformsSupported.push(<PlatformButton platform={platform.text} keyword={platform.keyword}/>)
            }
        });
        while(majorPlatformsSupported.length < 4 && otherPlatformsSupported.length > 0) {
            majorPlatformsSupported.push(otherPlatformsSupported.shift());
        }

        var moreButton;
        if(otherPlatformsSupported.length > 0 && !this.state.moreClicked) {
            moreButton = <li className="clickable" onClick={this.onClick}>...</li>
        }
        if (!this.state.moreClicked) {
            otherPlatformsSupported = null;
        }
        return (
            <ul className="supportedPlatforms">
                {majorPlatformsSupported}
                {moreButton}
                {otherPlatformsSupported}
            </ul>
        );
    }
});

module.exports = SupportedPlatforms;
