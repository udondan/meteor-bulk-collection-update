Package.describe({
  summary: "Bulk insert/update/delete documents in a collection",
  version: "0.2.0",
  git: "https://github.com/udondan/meteor-bulk-collection-update.git",
  environments: ['server']
});

Package.on_use(function (api) {
  api.versionsFrom("METEOR@0.9.0");
  where = 'server';
  api.add_files('lib/bulkCollectionUpdate.js', where);
  api.export && api.export('bulkCollectionUpdate', where);
});
