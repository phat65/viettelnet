import type { Package } from '@/payload-types'
import { PackageCard } from './PackageCard'
import { catalogGroups, type CatalogGroup } from '@/data/catalog'
import { Icon } from '@/components/ui/Icon'
import Link from 'next/link'
import { groupPath } from '@/lib/catalogRoutes'
import type { InternetProvince } from '@/lib/provinces'
import { PackageCarousel } from './PackageCarousel'

export function PackageList({ packages, groupId, province }: { packages: Package[]; groupId?: CatalogGroup; province?: InternetProvince }) {
  return <div id="goi-cuoc" className="catalog">
    {catalogGroups.filter((group) => !groupId || group.id === groupId).map((group) => {
      const items = packages.filter((item) => item.catalogGroup === group.id)
      return <section id={group.id} key={group.id} className={`catalog-section catalog-section--${group.id}`}>
        <div className="container">
          <div className="section-heading"><div className="section-heading-text">
            <h2>{province ? group.title : <Link href={groupPath(group.id)}>{group.title}</Link>}</h2><p>{group.description}</p>
          </div><span className="section-emblem"><Icon name={group.icon} width="34" height="34" /></span></div>
          {items.length > 0 ? <PackageCarousel count={items.length} label={group.title}>{items.map((item) => <PackageCard key={`${item.id}-${province?.slug || ''}`} item={item} province={province} />)}</PackageCarousel>
            : <p className="notice">Danh mục đang được đồng bộ. Vui lòng quay lại sau ít phút.</p>}
        </div>
      </section>
    })}
  </div>
}
