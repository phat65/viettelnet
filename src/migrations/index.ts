import * as migration_20261020_081029_initial from './20261020_081029_initial';
import * as migration_20261020_163916_showcase_contacts from './20261020_163916_showcase_contacts';
import * as migration_20261020_164000_seed_showcase from './20261020_164000_seed_showcase';
import * as migration_20261021_071953_editable_package_details from './20261021_071953_editable_package_details';
import * as migration_20261021_072000_regional_catalog from './20261021_072000_regional_catalog';
import * as migration_20261021_174014_registration_addresses from './20261021_174014_registration_addresses';
import * as migration_20261022_000000_bootstrap_admin from './20261022_000000_bootstrap_admin';
import * as migration_20261026_175832_editable_site_content from './20261026_175832_editable_site_content';

export const migrations = [
  {
    up: migration_20261020_081029_initial.up,
    down: migration_20261020_081029_initial.down,
    name: '20261020_081029_initial',
  },
  {
    up: migration_20261020_163916_showcase_contacts.up,
    down: migration_20261020_163916_showcase_contacts.down,
    name: '20261020_163916_showcase_contacts',
  },
  {
    up: migration_20261020_164000_seed_showcase.up,
    down: migration_20261020_164000_seed_showcase.down,
    name: '20261020_164000_seed_showcase',
  },
  {
    up: migration_20261021_071953_editable_package_details.up,
    down: migration_20261021_071953_editable_package_details.down,
    name: '20261021_071953_editable_package_details',
  },
  {
    up: migration_20261021_072000_regional_catalog.up,
    down: migration_20261021_072000_regional_catalog.down,
    name: '20261021_072000_regional_catalog',
  },
  {
    up: migration_20261021_174014_registration_addresses.up,
    down: migration_20261021_174014_registration_addresses.down,
    name: '20261021_174014_registration_addresses',
  },
  {
    up: migration_20261022_000000_bootstrap_admin.up,
    down: migration_20261022_000000_bootstrap_admin.down,
    name: '20261022_000000_bootstrap_admin',
  },
  {
    up: migration_20261026_175832_editable_site_content.up,
    down: migration_20261026_175832_editable_site_content.down,
    name: '20261026_175832_editable_site_content'
  },
];
