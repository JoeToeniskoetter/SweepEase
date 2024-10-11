import {
  InspectionLevel,
  InspectionTemplate,
} from 'src/inspection/entities/inspection_template.entity';
import { InspectionTemplateItem } from 'src/inspection/entities/inspection_template_items.entity';
import { InspectionTemplateOptions } from 'src/inspection/entities/inspection_template_options.entity';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

// Create a new TypeORM data source (adjust the config as per your setup)
const dataSource = new DataSource({
  type: 'postgres', // Or your DB type (MySQL, SQLite, etc.)
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgrespw',
  database: 'sweep_ease',
  entities: ['dist/**/*.entity.js'],
});

async function seedLevel1() {
  // Seed data for Level 1 inspection
  async function seed() {
    await dataSource.initialize();
    const itemRepository = dataSource.getRepository(InspectionTemplateItem);
    const itemOptionRepository = dataSource.getRepository(
      InspectionTemplateOptions,
    );

    // Data to seed for Level 1 inspection
    const items = [
      // Chimney Exterior
      {
        name: 'Structure Condition',
        position: 1,
        options: [
          {
            name: 'Intact',
            description: 'No visible damage to chimney structure',
          },
          {
            name: 'Cracked',
            description: 'Cracks or visible damage in the chimney structure',
          },
        ],
      },
      {
        name: 'Crown Condition',
        position: 2,
        options: [
          { name: 'Intact', description: 'No visible damage to chimney crown' },
          {
            name: 'Cracked',
            description: 'Visible cracks or damage in the chimney crown',
          },
        ],
      },
      {
        name: 'Cap Condition',
        position: 3,
        options: [
          {
            name: 'Present',
            description: 'Chimney cap is installed and in good condition',
          },
          {
            name: 'Missing/Damaged',
            description: 'Chimney cap is missing or damaged',
          },
        ],
      },
      {
        name: 'Flashing Condition',
        position: 4,
        options: [
          {
            name: 'Intact',
            description: 'Flashing is properly installed and no leaks',
          },
          {
            name: 'Loose/Damaged',
            description: 'Flashing is loose, damaged, or poorly sealed',
          },
        ],
      },
      // Fireplace Components
      {
        name: 'Firebox Condition',
        position: 5,
        options: [
          { name: 'Intact', description: 'No visible damage to the firebox' },
          {
            name: 'Cracked',
            description: 'Cracks or damage visible in the firebox',
          },
        ],
      },
      {
        name: 'Hearth Condition',
        position: 6,
        options: [
          { name: 'Intact', description: 'No visible damage to the hearth' },
          {
            name: 'Cracked',
            description: 'Cracks or damage visible on the hearth',
          },
        ],
      },
      {
        name: 'Damper Condition',
        position: 7,
        options: [
          {
            name: 'Operational',
            description: 'Damper is functional and operates smoothly',
          },
          {
            name: 'Stuck/Non-Operational',
            description: 'Damper is stuck or not operational',
          },
        ],
      },
      // Chimney Interior
      {
        name: 'Flue Liner Condition',
        position: 8,
        options: [
          {
            name: 'Intact',
            description: 'No visible cracks or damage to the flue liner',
          },
          {
            name: 'Cracked',
            description: 'Cracks or damage visible in the flue liner',
          },
        ],
      },
      {
        name: 'Smoke Chamber Condition',
        position: 9,
        options: [
          {
            name: 'Intact',
            description: 'Smoke chamber has no visible damage',
          },
          {
            name: 'Cracked',
            description: 'Cracks or damage visible in the smoke chamber',
          },
        ],
      },
      {
        name: 'Thimble Condition',
        position: 10,
        options: [
          { name: 'Present', description: 'Thimble is present and functional' },
          { name: 'Loose/Damaged', description: 'Thimble is loose or damaged' },
        ],
      },
      // Combustible Clearances
      {
        name: 'Clearance to Combustibles',
        position: 11,
        options: [
          {
            name: 'Adequate',
            description: 'Clearances around chimney and hearth are adequate',
          },
          {
            name: 'Inadequate',
            description:
              'Clearances around chimney and hearth are insufficient',
          },
        ],
      },
    ];

    let template = new InspectionTemplate();
    template.id = uuid();
    template.inspectionLevel = InspectionLevel.LEVEL_ONE;
    template.name = 'Level 1';
    template.signaturesRequired = true;
    template = await dataSource.manager.save(template);

    // Insert items and their options
    for (const itemData of items) {
      const item = new InspectionTemplateItem();
      item.id = uuid(); // Generate a new UUID
      item.name = itemData.name;
      item.position = itemData.position;
      item.template = template;

      const savedItem = await itemRepository.save(item);

      for (const optionData of itemData.options) {
        const option = new InspectionTemplateOptions();
        option.id = uuid(); // Generate a new UUID
        option.name = optionData.name;
        option.description = optionData.description;
        option.item = savedItem;

        await itemOptionRepository.save(option);
      }
    }

    console.log('Level 1 inspection seeding complete');
  }

  seed().catch((err) => {
    console.error('Error during seeding:', err);
  });
}

// Seed data
async function seedLevel2() {
  await dataSource.initialize();
  const itemRepository = dataSource.getRepository(InspectionTemplateItem);
  const itemOptionRepository = dataSource.getRepository(
    InspectionTemplateOptions,
  );

  // Data to seed
  const items = [
    // Chimney Exterior
    {
      name: 'Structure Condition',
      position: 1,
      options: [
        { name: 'Intact', description: 'No visible damage' },
        { name: 'Cracked', description: 'Visible cracks in the structure' },
      ],
    },
    {
      name: 'Crown Condition',
      position: 2,
      options: [
        { name: 'Intact', description: 'No visible damage' },
        { name: 'Cracked', description: 'Visible cracks or damage' },
      ],
    },
    {
      name: 'Flashing Condition',
      position: 3,
      options: [
        {
          name: 'Intact',
          description: 'Flashing properly installed and no leaks',
        },
        { name: 'Loose', description: 'Flashing is loose or poorly sealed' },
      ],
    },
    {
      name: 'Cap Condition',
      position: 4,
      options: [
        {
          name: 'Present',
          description: 'Chimney cap is installed and in good condition',
        },
        { name: 'Damaged', description: 'Chimney cap is damaged or missing' },
      ],
    },
    // Fireplace Components
    {
      name: 'Firebox Condition',
      position: 1,
      options: [
        { name: 'Intact', description: 'Firebox has no visible damage' },
        { name: 'Cracked', description: 'Cracks visible in the firebox' },
      ],
    },
    {
      name: 'Hearth Condition',
      position: 2,
      options: [
        { name: 'Intact', description: 'Hearth has no visible damage' },
        { name: 'Cracked', description: 'Cracks or damage on the hearth' },
      ],
    },
    {
      name: 'Damper Condition',
      position: 3,
      options: [
        {
          name: 'Operational',
          description: 'Damper opens and closes as expected',
        },
        { name: 'Stuck', description: 'Damper is stuck or not operational' },
      ],
    },
    {
      name: 'Fireplace Doors Condition',
      position: 4,
      options: [
        { name: 'Functional', description: 'Doors are functional and intact' },
        { name: 'Cracked Glass', description: 'Glass on the doors is cracked' },
      ],
    },
    {
      name: 'Gas Logs Condition',
      position: 5,
      options: [
        { name: 'Functional', description: 'Gas logs are functional and safe' },
        { name: 'Gas Leak', description: 'Evidence of gas leak' },
      ],
    },
    // Chimney Interior
    {
      name: 'Flue Liner Condition',
      position: 1,
      options: [
        {
          name: 'Intact',
          description: 'No visible cracks or damage in the liner',
        },
        { name: 'Cracked', description: 'Visible cracks in the flue liner' },
      ],
    },
    {
      name: 'Smoke Chamber Condition',
      position: 2,
      options: [
        { name: 'Intact', description: 'Smoke chamber has no visible damage' },
        { name: 'Cracked', description: 'Visible cracks in the smoke chamber' },
      ],
    },
    {
      name: 'Thimble Condition',
      position: 3,
      options: [
        { name: 'Present', description: 'Thimble is present and functional' },
        { name: 'Loose', description: 'Thimble is loose or not secure' },
      ],
    },
    // Venting System
    {
      name: 'Vent Pipes Condition',
      position: 1,
      options: [
        {
          name: 'Proper Installation',
          description: 'Venting pipes are installed correctly',
        },
        {
          name: 'Rusted',
          description: 'Venting pipes show signs of rust or wear',
        },
      ],
    },
    {
      name: 'Termination Point Condition',
      position: 2,
      options: [
        {
          name: 'Present',
          description: 'Termination point is properly installed',
        },
        {
          name: 'Damaged',
          description: 'Termination point is damaged or missing',
        },
      ],
    },
    // Structural Inspections
    {
      name: 'Attic Structure Condition',
      position: 1,
      options: [
        {
          name: 'Intact',
          description: 'Attic structure is intact with no damage',
        },
        {
          name: 'Cracked',
          description: 'Cracks or damage visible in attic structure',
        },
      ],
    },
    {
      name: 'Basement Structure Condition',
      position: 2,
      options: [
        {
          name: 'Intact',
          description: 'Basement structure is intact with no damage',
        },
        {
          name: 'Cracked',
          description: 'Cracks or damage visible in basement structure',
        },
      ],
    },
    // Combustible Clearances
    {
      name: 'Chimney Clearance Condition',
      position: 1,
      options: [
        {
          name: 'Adequate',
          description: 'Clearances around chimney are adequate',
        },
        {
          name: 'Inadequate',
          description: 'Clearances around chimney are insufficient',
        },
      ],
    },
    {
      name: 'Framing Clearance Condition',
      position: 2,
      options: [
        { name: 'Adequate', description: 'Framing clearances are adequate' },
        {
          name: 'Too Close',
          description: 'Framing is too close to the chimney',
        },
      ],
    },
    // Repairs and Recommendations
    {
      name: 'Repair Required',
      position: 1,
      options: [
        { name: 'Yes', description: 'Repair is required for this item' },
        { name: 'No', description: 'No repair needed' },
      ],
    },
    {
      name: 'Next Steps',
      position: 2,
      options: [
        { name: 'Monitor', description: 'Monitor condition over time' },
        {
          name: 'Further Inspection',
          description: 'Further inspection recommended',
        },
      ],
    },
  ];

  let template = new InspectionTemplate();
  template.id = uuid();
  template.inspectionLevel = InspectionLevel.LEVEL_TWO;
  template.name = 'Level 2';
  template.signaturesRequired = true;
  template = await dataSource.manager.save(template);

  // Insert items and their options
  for (const itemData of items) {
    const item = new InspectionTemplateItem();
    item.id = uuid(); // Generate a new UUID
    item.name = itemData.name;
    item.position = itemData.position;
    item.template = template;

    const savedItem = await itemRepository.save(item);

    for (const optionData of itemData.options) {
      const option = new InspectionTemplateOptions();
      option.id = uuid(); // Generate a new UUID
      option.name = optionData.name;
      option.description = optionData.description;
      option.item = savedItem;

      await itemOptionRepository.save(option);
    }
  }

  console.log('Seeding complete');
}

seedLevel1()
  .then(() => console.log('seed level 1 done'))
  .catch((e) => {
    console.log(e);
  });

seedLevel2()
  .then(() => console.log('seed level 2 done'))
  .catch((e) => {
    console.log(e);
  });
