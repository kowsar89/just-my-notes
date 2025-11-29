'use strict';

hexo.extend.tag.register('no_preview', function (args, content) {
  const inner = hexo.render.renderSync({ text: content, engine: 'markdown' });
  return '<!-- no_preview:start -->\n' + inner + '\n<!-- no_preview:end -->';
}, { ends: true });
