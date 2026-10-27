import type { Package } from '@/payload-types'
import { PackageCard } from './PackageCard'
import { catalogGroups, type CatalogGroup } from '@/data/catalog'
import { Icon } from '@/components/ui/Icon'
import Link from 'next/link'
import { groupPath } from '@/lib/catalogRoutes'

export function PackageList({ packages, groupId }: { packages: Package[]; groupId?: CatalogGroup }) {
  return <div id="goi-cuoc" className="catalog">
    {catalogGroups.filter((group) => !groupId || group.id === groupId).map((group) => {
      const items = packages.filter((item) => item.catalogGroup === group.id)
      return <section id={group.id} key={group.id} className={`catalog-section catalog-section--${group.id}`}>
        <div className="container">
          <div className="section-heading"><div className="section-heading-text">
            <h2><Link href={groupPath(group.id)}>{group.title}</Link></h2><p>{group.description}</p>
          </div><span className="section-emblem"><Icon name={group.icon} width="34" height="34" /></span></div>
          {items.length > 0 ? <div className={`package-grid package-grid--${items.length}`} role="region" aria-label={group.title} tabIndex={0}>{items.map((item) => <PackageCard key={item.id} item={item} />)}</div>
            : <p className="notice">Danh mục đang được đồng bộ. Vui lòng quay lại sau ít phút.</p>}
        </div>
      </section>
    })}
  </div>
}
