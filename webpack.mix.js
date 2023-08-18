const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */


mix.js('resources/js/app.js', 'public/js')
   .react('resources/js/views/Dashboard.js', 'public/js/views')
   .react('resources/js/views/Login.js', 'public/js/views')
   .react('resources/js/views/Leads.js', 'public/js/views')
   .react('resources/js/views/Setup.js', 'public/js/views')
   .react('resources/js/views/Roles.js', 'public/js/views')
   .react('resources/js/views/Users.js', 'public/js/views')
   .react('resources/js/views/Properties.js', 'public/js/views')
   .react('resources/js/views/OrderStatuses.js', 'public/js/views')
   .react('resources/js/views/Priorities.js', 'public/js/views')
   .react('resources/js/views/OrderTypes.js', 'public/js/views')
   .react('resources/js/views/DocumentTypes.js', 'public/js/views')
   .react('resources/js/views/AssetTypes.js', 'public/js/views')
   .react('resources/js/views/AssetWorks.js', 'public/js/views')
   .react('resources/js/views/Areas.js', 'public/js/views')
   .react('resources/js/views/Contractors.js', 'public/js/views')
   .react('resources/js/views/Vendors.js', 'public/js/views')
   .react('resources/js/views/SubAreas.js', 'public/js/views')
   .react('resources/js/views/Assets.js', 'public/js/views')
   .react('resources/js/views/PropertyTypes.js', 'public/js/views')
   .react('resources/js/views/AssetModel.js', 'public/js/views')
   .react('resources/js/views/Tenants.js', 'public/js/views')
   .react('resources/js/views/WorkTypes.js', 'public/js/views')
   .react('resources/js/views/Payments.js', 'public/js/views')
   .sass('resources/sass/app.scss', 'public/css')
   .sass('resources/sass/Leads.scss', 'public/css');
