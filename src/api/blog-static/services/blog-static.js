'use strict';

/**
 * blog-static service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::blog-static.blog-static');
